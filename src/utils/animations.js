import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { lenisInstance } from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

export const initialFX = () => {
  document.body.style.overflowY = "auto";
  if (lenisInstance) lenisInstance.start();

  const main = document.getElementsByTagName("main")[0];
  if (main) main.classList.add("main-active");

  gsap.to("body", { backgroundColor: "#0b080c", duration: 0.5, delay: 1 });

  const heroElements = [
    ".landing-info h3",
    ".landing-intro h2",
    ".landing-intro h1",
  ].flatMap((a) => Array.from(document.querySelectorAll(a)));

  if (heroElements.length > 0) {
    const split1 = new SplitType(heroElements, {
      types: "chars,lines",
      lineClass: "split-line",
    });
    gsap.fromTo(
      split1.chars,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      },
    );
  }

  const landingH2Info = document.querySelector(".landing-h2-info");
  if (landingH2Info) {
    const split2 = new SplitType(landingH2Info, {
      types: "chars,lines",
      lineClass: "split-h2",
    });
    gsap.fromTo(
      split2.chars,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      },
    );
  }

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", y: 0, delay: 0.8 },
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 },
  );
};

export const setupScrollAnimations = () => {
  // CRITICAL FOR MOBILE: Prevents jumping/glitching when the mobile URL bar hides/shows
  ScrollTrigger.config({ ignoreMobileResize: true });

  const isMobile = window.innerWidth <= 768;
  const startPos = isMobile ? "top 80%" : "top 75%";

  const paras = document.querySelectorAll(".para");
  const titles = document.querySelectorAll(".title");

  paras.forEach((el) => {
    el.classList.add("visible");
    if (el.anim) {
      el.anim.scrollTrigger?.kill();
      el.anim.kill();
      el.split?.revert?.();
    }

    el.split = new SplitType(el, {
      types: "lines,words",
      lineClass: "split-line",
    });

    // Use GSAP's native toggleActions instead of manual play()/reverse() callbacks.
    // toggleActions handles rapid scroll state changes internally — no glitch on mobile touch.
    // Format: "onEnter onLeave onEnterBack onLeaveBack"
    el.anim = gsap.fromTo(
      el.split.words,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.02,
        scrollTrigger: {
          trigger: el,
          start: startPos,
          invalidateOnRefresh: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  titles.forEach((el) => {
    if (el.anim) {
      el.anim.scrollTrigger?.kill();
      el.anim.kill();
      el.split?.revert?.();
    }

    el.split = new SplitType(el, {
      types: isMobile ? "lines,words" : "chars,lines",
      lineClass: "split-line",
    });

    el.anim = gsap.fromTo(
      isMobile ? el.split.words : el.split.chars,
      { autoAlpha: 0, y: 50, rotate: isMobile ? 0 : 10 },
      {
        autoAlpha: 1,
        y: 0,
        rotate: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: el,
          start: startPos,
          invalidateOnRefresh: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

export const setupCareerAnimation = () => {
  const e = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });

  e.fromTo(
    ".career-timeline",
    { maxHeight: "0%" },
    { maxHeight: "100%", duration: 1, ease: "none" },
    0,
  )
    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
      0,
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0,
    );

  if (window.innerWidth > 1024) {
    e.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0,
    );
  } else {
    e.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0,
    );
  }
};
