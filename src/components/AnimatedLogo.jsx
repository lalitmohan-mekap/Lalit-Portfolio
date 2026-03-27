import React from "react";
import "./AnimatedLogo.css";

export const AnimatedLogo = () => {
  return (
    <div className="animated-logo-container">
      <svg
        width="50"
        height="30"
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="nav-animated-logo"
      >
        {/* L Outer shape */}
        <path
          className="neon-path outer-path"
          d="M 10 5 L 10 55 L 45 55"
          stroke="#c2a4ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* L Inner shape */}
        <path
          className="neon-path inner-path"
          d="M 22 18 L 22 43 L 38 43"
          stroke="#c2a4ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* M Outer shape */}
        <path
          className="neon-path outer-path"
          d="M 52 5 L 52 55 M 52 5 L 75 32 L 98 5 L 98 55"
          stroke="#c2a4ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* M Inner shape accent */}
        <path
          className="neon-path inner-path"
          d="M 64 36 L 75 48 L 86 36"
          stroke="#c2a4ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default AnimatedLogo;
