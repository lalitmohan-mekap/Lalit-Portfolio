import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../data/config";
import "./Navbar.css";
import AnimatedLogo from "./AnimatedLogo";

gsap.registerPlugin(ScrollTrigger);

export const HoverLink = ({ text, cursor }) => {
  return (
    <div className="hover-link" data-cursor={!cursor ? "disable" : undefined}>
      <div className="hover-in">
        {text} <div>{text}</div>
      </div>
    </div>
  );
};

export let lenisInstance = null;

export const Navbar = () => {
  useEffect(() => {
    lenisInstance = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      syncTouch: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    const raf = (time) => {
      lenisInstance?.raf(time * 1000);
    };

    lenisInstance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const handleLinkClick = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("data-href");
      if (targetId && lenisInstance) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          lenisInstance.scrollTo(targetElement, { offset: 0, duration: 1.5 });
        }
      }
    };

    const links = document.querySelectorAll(".header ul a");
    links.forEach((a) => a.addEventListener("click", handleLinkClick));

    const handleResize = () => lenisInstance?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      links.forEach((a) => a.removeEventListener("click", handleLinkClick));
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(raf);
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <>
      <div className="header">
        <a
          href="/#"
          className="navbar-title"
          data-cursor="disable"
          style={{ display: "flex", alignItems: "center" }}
          onClick={(e) => {
            e.preventDefault();
            if (lenisInstance) {
              lenisInstance.scrollTo(0, { duration: 1.5 });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <AnimatedLogo />
        </a>

        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLink text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLink text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLink text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
