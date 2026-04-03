import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { config } from "../data/config";

export const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    let isActive = false;
    const cursor = cursorRef.current;

    if (!cursor) return;

    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.1 });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.1 });

    let rafId;
    const render = () => {
      if (!isActive) {
        const speed = 6;
        pos.x += (mouse.x - pos.x) / speed;
        pos.y += (mouse.y - pos.y) / speed;
        moveX(pos.x);
        moveY(pos.y);
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const interactiveElements = document.querySelectorAll("[data-cursor]");
    const handleMouseOver = (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      if (el.dataset.cursor === "icons") {
        cursor.classList.add("cursor-icons");
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        isActive = true;
      }
      if (el.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      isActive = false;
    };

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export const SocialIcons = () => {
  useEffect(() => {
    const parent = document.getElementById("social");
    if (!parent) return;

    const cleanupFns = [];

    parent.querySelectorAll("span").forEach((span) => {
      const a = span.querySelector("a");
      if (!a) return;

      // Cache rect — only recompute on resize, not every mousemove
      let cachedRect = span.getBoundingClientRect();
      let targetX = cachedRect.width / 2;
      let targetY = cachedRect.height / 2;
      let currX = targetX;
      let currY = targetY;
      let isHovered = false;
      let rafId = null;

      const handleResize = () => {
        cachedRect = span.getBoundingClientRect();
      };

      // rAF loop — only runs during hover
      const render = () => {
        currX += 0.1 * (targetX - currX);
        currY += 0.1 * (targetY - currY);
        a.style.setProperty("--siLeft", `${currX}px`);
        a.style.setProperty("--siTop", `${currY}px`);
        if (isHovered) {
          rafId = requestAnimationFrame(render);
        } else {
          rafId = null;
        }
      };

      const handleMove = (e) => {
        const localX = e.clientX - cachedRect.left;
        const localY = e.clientY - cachedRect.top;
        if (localX < 40 && localX > 10 && localY < 40 && localY > 5) {
          targetX = localX;
          targetY = localY;
        } else {
          targetX = cachedRect.width / 2;
          targetY = cachedRect.height / 2;
        }
      };

      const handleEnter = () => {
        isHovered = true;
        cachedRect = span.getBoundingClientRect();
        if (!rafId) rafId = requestAnimationFrame(render);
      };

      const handleLeave = () => {
        isHovered = false;
        targetX = cachedRect.width / 2;
        targetY = cachedRect.height / 2;
        // Run one final settle frame
        if (!rafId) rafId = requestAnimationFrame(render);
      };

      span.addEventListener("mouseenter", handleEnter);
      span.addEventListener("mouseleave", handleLeave);
      document.addEventListener("mousemove", handleMove);
      window.addEventListener("resize", handleResize);

      // Initialize position without starting a loop
      a.style.setProperty("--siLeft", `${currX}px`);
      a.style.setProperty("--siTop", `${currY}px`);

      cleanupFns.push(() => {
        span.removeEventListener("mouseenter", handleEnter);
        span.removeEventListener("mouseleave", handleLeave);
        document.removeEventListener("mousemove", handleMove);
        window.removeEventListener("resize", handleResize);
        if (rafId) cancelAnimationFrame(rafId);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {config.contact.github && (
          <span>
            <a
              href={config.contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 496 512">
                <path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                />
              </svg>
            </a>
          </span>
        )}
        {config.contact.linkedin && (
          <span>
            <a
              href={config.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                />
              </svg>
            </a>
          </span>
        )}
        {config.contact.instagram && (
          <span>
            <a
              href={config.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                />
              </svg>
            </a>
          </span>
        )}
      </div>
      <a
        className="resume-button"
        href={`${import.meta.env.BASE_URL}Lalit_Mohan_Mekap_Resume.pdf`}
        download="Lalit_Mohan_Mekap_Resume.pdf"
      >
        <div>RESUME</div>
        <span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
            <path d="M9 7l6 0" />
            <path d="M9 11l6 0" />
            <path d="M9 15l4 0" />
          </svg>
        </span>
      </a>
    </div>
  );
};
