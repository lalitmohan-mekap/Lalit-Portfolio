import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const words = ["Hello", "Bonjour", "Namaste", "Ciao", "Olá", "Guten Tag"];

export default function Preloader({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const orbsRef = useRef(null);
  const progressRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Animated counter 0 → 100
  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 2.8,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(obj.val)),
    });
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "100%",
        duration: 2.8,
        ease: "power2.inOut",
      });
    }
  }, []);

  // Floating orbs parallax
  useEffect(() => {
    if (!orbsRef.current) return;
    const orbs = orbsRef.current.querySelectorAll(".preloader-orb");
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: `random(-60, 60)`,
        x: `random(-40, 40)`,
        duration: 2 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  // Word cycling
  useEffect(() => {
    if (index === words.length - 1) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }, 600);
      return;
    }

    const timer = setTimeout(
      () => setIndex((prev) => prev + 1),
      index === 0 ? 800 : 400
    );
    return () => clearTimeout(timer);
  }, [index, onComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  const slideUp = {
    initial: { y: 0 },
    exit: {
      y: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0b080c",
        zIndex: 999999999,
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <div ref={orbsRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          className="preloader-orb"
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(194,164,255,0.25) 0%, transparent 70%)",
            top: "10%",
            left: "15%",
            filter: "blur(60px)",
          }}
        />
        <div
          className="preloader-orb"
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(170,66,255,0.2) 0%, transparent 70%)",
            bottom: "5%",
            right: "10%",
            filter: "blur(80px)",
          }}
        />
        <div
          className="preloader-orb"
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,141,255,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "60%",
            filter: "blur(50px)",
          }}
        />
      </div>

      {dimension.width > 0 && (
        <>
          {/* Center content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "30px",
            }}
          >
            {/* Greeting text with AnimatePresence for smooth transitions */}
            <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={words[index]}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.15, ease: [0.76, 0, 0.24, 1] }}
                  className="elegant-serif-name"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#c2a4ff",
                    fontSize: "clamp(36px, 5vw, 72px)",
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                    margin: 0,
                    textShadow: "0 0 40px rgba(194,164,255,0.3)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#c2a4ff",
                      borderRadius: "50%",
                      marginRight: "16px",
                      boxShadow: "0 0 20px #c2a4ff, 0 0 60px rgba(194,164,255,0.4)",
                    }}
                  />
                  {words[index]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: "clamp(200px, 30vw, 400px)",
                height: "2px",
                backgroundColor: "rgba(194,164,255,0.15)",
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                ref={progressRef}
                style={{
                  width: "0%",
                  height: "100%",
                  background: "linear-gradient(90deg, #aa42ff, #c2a4ff, #fb8dff)",
                  borderRadius: "4px",
                  boxShadow: "0 0 15px rgba(194,164,255,0.6)",
                }}
              />
            </div>

            {/* Percentage counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#eae5ec",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              {count}%
            </motion.div>
          </div>

          {/* SVG liquid curve for exit */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "calc(100% + 300px)",
              pointerEvents: "none",
            }}
          >
            <motion.path
              variants={curve}
              initial="initial"
              animate={isExiting ? "exit" : "initial"}
              fill="#0b080c"
            />
          </svg>
        </>
      )}
    </motion.div>
  );
}
