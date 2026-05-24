import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { config } from "../data/config";
import FlowFieldBackground from "./FlowFieldBackground";
import { Cursor } from "./Cursor";
import "./MyWorks.css";

import Lenis from "lenis";

export const MyWorks = () => {
  useEffect(() => {
    // Scroll to top when loading the page
    window.scrollTo(0, 0);

    // Initialize Lenis smooth scrolling for this page too
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      syncTouch: false,
      touchMultiplier: isTouchDevice ? 1 : 1.5,
      infinite: false,
    });

    const raf = (time) => {
      lenis.raf(time);
    };

    requestAnimationFrame(raf);
    
    let animationFrameId;
    const loop = (time) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="myworks-page" style={{ position: "relative" }}>
      <Cursor />
      <FlowFieldBackground color="#c2a4ff" particleCount={250} speed={1} trailOpacity={0.15} />
      <div className="myworks-nav">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>

      <div className="myworks-header">
        <h1>
          All <span>Projects</span>
        </h1>
        <p>
          A complete archive of my applications, research, and technical
          experiments.
        </p>
      </div>

      <div className="myworks-grid">
        {config.projects.map((proj) => (
          <div className="myworks-card" key={proj.id}>
            <div className="myworks-card-image">
              <img src={proj.image} alt={proj.title} />
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="myworks-card-link"
                >
                  View Project
                </a>
              )}
            </div>
            <div className="myworks-card-content">
              <span className="myworks-category">{proj.category}</span>
              <h2>{proj.title}</h2>
              <div className="myworks-tech">
                {proj.technologies.split(",").map((tech, idx) => (
                  <span key={idx}>{tech.trim()}</span>
                ))}
              </div>
              <p>{proj.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWorks;
