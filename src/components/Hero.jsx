import React from "react";
import { config } from "../data/config";
import FlowFieldBackground from "./FlowFieldBackground";

export const Hero = ({ children }) => {
  const parts = config.developer.fullName.split(" ");
  const first = parts[0] || config.developer.name;
  const rest = parts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1 className="elegant-serif-name">
              {first} <br />
              {rest && <span>{rest}</span>}
            </h1>
          </div>

          <div className="hero-center-image">
            <img src="./images/Lalit.png" alt="Lalit Portrait" />
          </div>

          <div className="landing-info">
            <h3>An</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">AI Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">
                Full-Stack <br className="desktop-only-br" />{" "}
                <span className="shift-developer">Developer</span>
              </div>
            </h2>
          </div>
          <div className="mobile-photo">
            <img src="./images/Lalit.png" alt={config.developer.fullName} />
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Hero;
