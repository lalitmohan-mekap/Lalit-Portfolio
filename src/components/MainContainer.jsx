import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./Navbar";
import { Cursor, SocialIcons } from "./Cursor";
import Hero from "./Hero";
import About from "./About";
import WhatIDo from "./WhatIDo";
import Career from "./Career";
import Work from "./Work";
import TechStack from "./TechStack";
import Contact from "./Contact";

import "./MainContainer.css";

gsap.registerPlugin(ScrollTrigger);

import {
  initialFX,
  setupScrollAnimations,
  setupCareerAnimation,
} from "../utils/animations";

export const MainContainer = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const initialized = useRef(false);

  useEffect(() => {
    // Track width to distinguish real resizes from mobile address bar toggling
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setIsDesktop(newWidth > 1024);

      // Only re-run animations on actual width changes (e.g. orientation flip).
      // Mobile address bar show/hide only changes HEIGHT — skip those.
      // ScrollTrigger.refresh() (via invalidateOnRefresh) handles height changes.
      if (newWidth !== lastWidth) {
        lastWidth = newWidth;
        setupScrollAnimations();
      }
    };

    // Delay slightly to ensure fonts have loaded before measuring splits
    if (!initialized.current) {
      initialized.current = true;
      setTimeout(() => {
        initialFX();
        setupScrollAnimations();
        setupCareerAnimation();
      }, 100);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />

      {isDesktop && <div className="background-elements"></div>}

      <div className="content-wrapper">
        <Hero />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStack />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
