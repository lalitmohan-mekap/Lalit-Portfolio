import React, { useEffect } from "react";
import { Mail, MapPin, Map, Send } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../data/config";
import { LocationMap } from "./LocationMap";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

const GithubIcon = () => (
  <svg viewBox="0 0 496 512">
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 448 512">
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 448 512">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);

export const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = React.useState({});
  const [submitStatus, setSubmitStatus] = React.useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitStatus("loading");

    // Check if formspreeEndpoint is configured
    if (
      !config.contact.formspreeEndpoint ||
      config.contact.formspreeEndpoint.includes("YOUR_ENDPOINT_HERE")
    ) {
      const mailtoLink = `mailto:${config.contact.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      window.location.href = mailtoLink;
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
      return;
    }

    try {
      const response = await fetch(config.contact.formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, "errors")) {
          setErrors({
            message: data.errors.map((error) => error.message).join(", "),
          });
        }
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    }

    setTimeout(() => {
      setSubmitStatus((prev) => (prev === "error" ? "error" : "idle"));
    }, 5000);
  };

  useEffect(() => {
    const e = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    e.fromTo(
      ".contact-header",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
    e.fromTo(
      ".contact-left > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.4",
    );
    e.fromTo(
      ".contact-right",
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6",
    );

    return () => {
      e.kill();
    };
  }, []);

  return (
    <div className="contact-wrapper">
      <div className="contact-section" id="contact">
        <div className="contact-header">
          <span className="contact-badge">Get in Touch</span>
          <h2 className="title">
            Contact <span>Me</span>
          </h2>
          <p className="para">
            I'm always open to discussing new projects, creative ideas or
            opportunities to be part of your visions.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-left">
            <h3>Let's Talk</h3>
            <p className="contact-subtitle">
              Feel free to reach out to me for any questions, collaboration
              opportunities, or just to say hello!
            </p>

            <div className="contact-info-card">
              <div className="contact-icon">
                <Mail size={20} />
              </div>
              <div className="contact-info-text">
                <span>Email</span>
                <a
                  href={`mailto:${config.contact.email}`}
                  data-cursor="disable"
                >
                  {config.contact.email}
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>
              <div className="contact-info-text">
                <span>Location</span>
                <p>{config.social.location}</p>
              </div>
            </div>

            <div className="contact-current-location">
              <span>Current Location</span>
              <LocationMap
                location={config.social.location}
                coordinates="20.2961° N, 85.8245° E"
              />
            </div>

            <div className="contact-socials">
              <span>Follow me on</span>
              <div className="social-links">
                <a
                  href={config.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                >
                  <GithubIcon />
                </a>
                <a
                  href={config.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href={config.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={errors.name ? "input-error shake" : ""}
                    data-cursor="disable"
                  />
                  {errors.name && (
                    <span className="error-text">{errors.name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? "input-error shake" : ""}
                    data-cursor="disable"
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className={errors.subject ? "input-error shake" : ""}
                  data-cursor="disable"
                />
                {errors.subject && (
                  <span className="error-text">{errors.subject}</span>
                )}
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows="4"
                  className={errors.message ? "input-error shake" : ""}
                  data-cursor="disable"
                ></textarea>
                {errors.message && (
                  <span className="error-text">{errors.message}</span>
                )}
              </div>
              <button
                type="submit"
                className="send-btn"
                data-cursor="disable"
                disabled={submitStatus === "loading"}
              >
                <Send size={18} />{" "}
                {submitStatus === "loading" ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <div className="status-message status-success">
                  Your message has been sent successfully! I'll get back to you
                  soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="status-message status-error">
                  Oops! Something went wrong. Please try again later.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <footer className="global-footer">
        <p>
          Designed and developed by <span className="footer-name">Lalit</span> ©
          2025
        </p>
      </footer>
    </div>
  );
};

export default Contact;
