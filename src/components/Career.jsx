import React from "react";
import { config } from "../data/config";

export const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot" />
          </div>
          {config.experiences.map((exp, i) => {
            const period = exp.period;
            const displayDate = period.includes("Present")
              ? "NOW"
              : period.includes(" - ")
                ? period.split(" - ")[0]
                : period;

            return (
              <div className="career-info-box" key={i}>
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{exp.position}</h4>
                    <h5>{exp.company}</h5>
                  </div>
                  <h3>{displayDate}</h3>
                </div>
                <p>{exp.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Career;
