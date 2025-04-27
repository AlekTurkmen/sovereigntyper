"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(55, 55, 55)",
  gradientBackgroundEnd = "rgb(0, 0, 0)",
  firstColor = "54, 69, 79",
  secondColor = "51, 51, 51",
  thirdColor = "33, 34, 34",
  fourthColor = "86, 83, 80",
  fifthColor = "86, 83, 80",
  pointerColor = "245, 242, 208",
  // pointerColor = "224, 185, 85",
  size = "100%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
  isTransitioning = false,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
  isTransitioning?: boolean;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      if (!document.hidden && interactiveRef.current) {
        // Reset positions when becoming visible
        setCurX(0);
        setCurY(0);
        setTgX(0);
        setTgY(0);
        interactiveRef.current.style.transform = 'translate(0px, 0px)';
      }
    };

    const handleFocus = () => {
      setIsVisible(true);
      // Force an immediate movement update on focus
      if (interactiveRef.current) {
        requestAnimationFrame(() => {
          if (interactiveRef.current) {
            interactiveRef.current.style.transform = 'translate(0px, 0px)';
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Handle transition state to pause the animation
  useEffect(() => {
    if (isTransitioning) {
      // Add a delay before completely pausing the animation
      const timeoutId = setTimeout(() => {
        setIsPaused(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timeoutId);
    } else {
      setIsPaused(false);
    }
  }, [isTransitioning]);

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    function move() {
      if (!interactiveRef.current || !isVisible || isPaused) {
        return;
      }
      
      // Slow down the animation when transitioning
      const speed = isTransitioning ? 40 : 20; // Higher number = slower animation
      
      setCurX(prevX => prevX + (tgX - prevX) / speed);
      setCurY(prevY => prevY + (tgY - prevY) / speed);
      
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      animationFrameId = requestAnimationFrame(move);
    }

    move();
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tgX, tgY, isVisible, isPaused, isTransitioning]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current && isVisible && !isPaused) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div
        className={cn(
          "gradients-container h-full w-full blur-2xl transition-opacity duration-500 ease-in-out pointer-events-none",
          isSafari ? "blur-3xl" : "[filter:url(#blurMe)_blur(60px)]",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:center_center] pointer-events-none`,
            isTransitioning ? "" : "animate-first",
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-400px)] pointer-events-none`,
            isTransitioning ? "" : "animate-second",
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%+400px)] pointer-events-none`,
            isTransitioning ? "" : "animate-third",
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-200px)] pointer-events-none`,
            isTransitioning ? "" : "animate-fourth",
            `opacity-70`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)] pointer-events-none`,
            isTransitioning ? "" : "animate-fifth",
            `opacity-100`
          )}
        ></div>

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_40%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70`,
              isPaused ? "pointer-events-none" : ""
            )}
          ></div>
        )}
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        <p className="text-sm opacity-50 text-gray-400 hover:opacity-100 transition-opacity">
          <a 
            href="https://x.com/AlekTurkmen" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gray-200 transition-colors"
          >
            &copy; Alek Turkmen
          </a>  
        </p>
      </div> */}
    </div>
  );
};
