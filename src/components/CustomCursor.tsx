"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

type CursorState = "default" | "text" | "clickable";

export default function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [cursorState, setCursorState] = useState<CursorState>("default");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const observer = new MutationObserver(() => {
            const open = document.documentElement.classList.contains('modal-open');
            setIsModalOpen(open);
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });
        setIsModalOpen(document.documentElement.classList.contains('modal-open'));
        return () => observer.disconnect();
    }, []);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Precise, instant inner dot spring
    const dotSpringConfig = { damping: 40, stiffness: 800 };
    const dotX = useSpring(mouseX, dotSpringConfig);
    const dotY = useSpring(mouseY, dotSpringConfig);

    // Fluid, organic outer ring spring
    const ringSpringConfig = { damping: 22, stiffness: 140 };
    const ringX = useSpring(mouseX, ringSpringConfig);
    const ringY = useSpring(mouseY, ringSpringConfig);

    useEffect(() => {
        // Don't show custom cursor on touch screens
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        if (isTouchDevice) {
            setIsVisible(false);
            return;
        }

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            // Check if interactive link/button
            const isClickable = 
                target.tagName === "A" || 
                target.tagName === "BUTTON" || 
                target.closest("a") || 
                target.closest("button") ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer") ||
                target.tagName === "INPUT" ||
                target.tagName === "SELECT" ||
                target.tagName === "TEXTAREA";

            // Check if standard text element
            const isText = 
                !isClickable && (
                    target.tagName === "P" || 
                    target.tagName === "SPAN" || 
                    target.tagName === "H1" || 
                    target.tagName === "H2" || 
                    target.tagName === "H3" || 
                    target.tagName === "H4" || 
                    target.tagName === "H5" || 
                    target.tagName === "H6" || 
                    target.tagName === "LI" || 
                    target.tagName === "LABEL" || 
                    target.tagName === "STRONG" || 
                    target.tagName === "EM" ||
                    target.tagName === "B" ||
                    target.tagName === "I"
                );

            if (isClickable) {
                setCursorState("clickable");
            } else if (isText) {
                setCursorState("text");
            } else {
                setCursorState("default");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [mouseX, mouseY, isVisible]);

    // Spring values for scales and transitions
    const getRingVariants = () => {
        switch (cursorState) {
            case "text":
                return {
                    width: 72,
                    height: 72,
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    borderWidth: "0px",
                    borderStyle: "none",
                    borderColor: "transparent",
                };
            case "clickable":
                return {
                    width: 48,
                    height: 48,
                    backgroundColor: "rgba(0, 135, 90, 0.15)",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: "rgba(0, 135, 90, 1)",
                };
            case "default":
            default:
                return {
                    width: 32,
                    height: 32,
                    backgroundColor: "rgba(0, 135, 90, 0)",
                    borderWidth: "1.5px",
                    borderStyle: "solid",
                    borderColor: "rgba(0, 135, 90, 0.6)",
                };
        }
    };

    const getDotVariants = () => {
        switch (cursorState) {
            case "text":
                return {
                    scale: 0,
                    backgroundColor: "#00875a",
                };
            case "clickable":
                return {
                    scale: 1.5,
                    backgroundColor: "#00a86b",
                    boxShadow: "0 0 10px rgba(0, 168, 107, 0.5)",
                };
            case "default":
            default:
                return {
                    scale: 1,
                    backgroundColor: "#00875a",
                    boxShadow: "none",
                };
        }
    };

    if (!mounted || !isVisible || isModalOpen) return null;

    return (
        <>
            {/* Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                animate={getRingVariants()}
                transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.5 }}
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    mixBlendMode: cursorState === "text" ? "difference" : "normal",
                }}
            />
            {/* Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
                animate={getDotVariants()}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />
        </>
    );
}
