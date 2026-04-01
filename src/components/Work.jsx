import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { config } from "../data/config";

gsap.registerPlugin(ScrollTrigger);

const WorkBoxImage = ({ link, video, image, alt }) => {
  const [hover, setHover] = useState(false);
  const [vidSrc, setVidSrc] = useState("");

  useEffect(() => {
    return () => {
      if (vidSrc) {
        URL.revokeObjectURL(vidSrc);
      }
    };
  }, [vidSrc]);

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={link || "#"}
        onMouseEnter={async () => {
          if (video) {
            setHover(true);
            if (vidSrc) {
              URL.revokeObjectURL(vidSrc);
            }
            try {
              const e = await fetch(`/${video}`);
              const t = await e.blob();
              setVidSrc(URL.createObjectURL(t));
            } catch (err) {
              console.error("Error loading video:", err);
            }
          }
        }}
        onMouseLeave={() => setHover(false)}
        target={link ? "_blank" : "_self"}
        rel="noopener noreferrer"
        data-cursor="disable"
      >
        <img src={image} alt={alt} />
        {hover && vidSrc && (
          <video src={vidSrc} autoPlay muted playsInline loop />
        )}
      </a>
    </div>
  );
};

export const Work = () => {
  useEffect(() => {
    if (window.innerWidth <= 1024) return;

    let dist = 0;
    const calculateDist = () => {
      const boxes = document.getElementsByClassName("work-box");
      if (boxes.length === 0) return;
      const t = document
        .querySelector(".work-container")
        .getBoundingClientRect().left;
      const n = boxes[0].getBoundingClientRect();
      const i = boxes[0].parentElement.getBoundingClientRect().width;
      const padding =
        parseInt(window.getComputedStyle(boxes[0]).paddingLeft) || 0;
      dist = n.width * boxes.length - (t + i) + padding;
    };

    calculateDist();

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${dist}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    tl.to(".work-flex", { x: -dist, ease: "none" });
    ScrollTrigger.refresh();

    return () => {
      tl.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 3).map((proj, i) => (
            <div className="work-box" key={proj.id || i}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{i + 1}</h3>
                  <div>
                    <h4>{proj.title}</h4>
                    <p>{proj.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{proj.technologies}</p>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="see-all-btn"
                    style={{
                      width: "fit-content",
                      padding: "10px 25px",
                      marginTop: "10px",
                      fontSize: "14px",
                    }}
                    data-cursor="disable"
                  >
                    <span className="see-all-btn-text">Visit Live App</span>
                  </a>
                )}
              </div>
              <WorkBoxImage
                link={proj.link}
                video={proj.video}
                image={proj.image}
                alt={proj.title}
              />
            </div>
          ))}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                <span className="see-all-btn-text">See All Works</span> →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
