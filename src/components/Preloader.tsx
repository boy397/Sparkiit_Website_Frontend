"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Center, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { motion } from "framer-motion";

const PARTICLE_COUNT = 2000;

function Particles({ onComplete, containerRef, isExiting }: { onComplete: () => void, containerRef: React.RefObject<HTMLDivElement | null>, isExiting: boolean }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const rotationIntensity = useRef({ value: 1 });
    const animatedRef = useRef(false);

    // Initial Sphere Positions
    const spherePositions = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
            const r = 2; // Radius

            positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, []);

    // Random Scattered Positions
    const scatteredPositions = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, []);

    // Particle Loader timeline: cosmic scatter and fade-out when isExiting is triggered
    useEffect(() => {
        if (!isExiting || !pointsRef.current || animatedRef.current) return;
        animatedRef.current = true;

        const currentPos = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        const tl = gsap.timeline({
            onComplete: () => {
                onComplete();
            }
        });

        // 1. Cosmic Scatter (Explosion) (reduced duration)
        tl.to(currentPos, {
            duration: 1.0,
            ease: "expo.out",
            onUpdate: function(this: any) {
                const progress = this.progress();
                for (let i = 0; i < currentPos.length; i++) {
                    currentPos[i] = THREE.MathUtils.lerp(spherePositions[i], scatteredPositions[i], progress);
                }
                if (pointsRef.current) {
                    pointsRef.current.geometry.attributes.position.needsUpdate = true;
                }
            }
        });

        // 2. Fade out the entire container during the scatter animation (reduced duration)
        if (containerRef.current) {
            tl.to(containerRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut"
            }, "-=0.8");
        }

    }, [isExiting, onComplete, spherePositions, scatteredPositions, containerRef]);

    useFrame((state) => {
        if (rotationIntensity.current.value > 0) {
            const time = state.clock.getElapsedTime();
            pointsRef.current.rotation.y = time * 0.1 * rotationIntensity.current.value;
            pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.05 * rotationIntensity.current.value;
        } else {
            // Ensure it's perfectly straight when rotation stops
            pointsRef.current.rotation.x = 0;
            pointsRef.current.rotation.y = 0;
        }
    });

    return (
        <group>
            <Points ref={pointsRef} positions={spherePositions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00875a"
                    size={0.04}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            
            {/* Ambient Glow */}
            <mesh scale={[20, 20, 1]}>
                <planeGeometry />
                <meshBasicMaterial 
                    transparent 
                    opacity={0.05} 
                    color="#00875a" 
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

export default function ParticleLoader({ onComplete, loading = false }: { onComplete: () => void; loading?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const completedRef = useRef(false);
    const [minTimePassed, setMinTimePassed] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleComplete = React.useCallback(() => {
        if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
        }
    }, [onComplete]);

    // Minimum display time of 1.2s for the preloader
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimePassed(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // Set exiting state when both minimum time has passed and API load is complete
    useEffect(() => {
        if (minTimePassed && !loading) {
            setIsExiting(true);
        }
    }, [minTimePassed, loading]);

    // Safety fallback: exit after 5 seconds even if still loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden">
                <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                    <Particles onComplete={handleComplete} containerRef={containerRef} isExiting={isExiting} />
                </Canvas>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-radial-gradient from-[#00875a]/5 to-transparent pointer-events-none" />
                
                <style jsx>{`
                    .bg-radial-gradient {
                        background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%);
                    }
                `}</style>
            </div>
        </motion.div>
    );
}
