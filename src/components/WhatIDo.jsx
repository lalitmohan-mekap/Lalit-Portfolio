import React, { useEffect, useRef } from "react";
import { config } from "../data/config";

export const WhatIDo = () => {
  const contentRefs = useRef([]);

  const setRef = (el, i) => {
    contentRefs.current[i] = el;
  };

  const handleClick = (e) => {
    const el = e.currentTarget;
    el.classList.toggle("what-content-active");
    el.classList.remove("what-sibling");

    if (el.parentElement) {
      Array.from(el.parentElement.children).forEach((sibling) => {
        if (sibling !== el) {
          sibling.classList.remove("what-content-active");
          sibling.classList.toggle("what-sibling");
        }
      });
    }
  };

  useEffect(() => {
    // Handling generic touch logic manually instead of ScrollTrigger.isTouch for simplicity
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    if (isTouch) {
      contentRefs.current.forEach((el) => {
        if (el) {
          el.classList.remove("what-noTouch");
          el.addEventListener("click", handleClick);
        }
      });
    }

    return () => {
      contentRefs.current.forEach((el) => {
        if (el) {
          el.removeEventListener("click", handleClick);
        }
      });
    };
  }, []);

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            &nbsp;I&nbsp;<span className="do-h2">DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>

          <div className="what-content what-noTouch" ref={(e) => setRef(e, 0)}>
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>{config.skills.develop.title}</h3>
              <h4>{config.skills.develop.description}</h4>
              <p>{config.skills.develop.details}</p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                {config.skills.develop.tools.map((skill, i) => (
                  <div className="what-tags" key={i}>
                    {skill}
                  </div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

          <div className="what-content what-noTouch" ref={(e) => setRef(e, 1)}>
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>{config.skills.design.title}</h3>
              <h4>{config.skills.design.description}</h4>
              <p>{config.skills.design.details}</p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                {config.skills.design.tools.map((skill, i) => (
                  <div className="what-tags" key={i}>
                    {skill}
                  </div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
