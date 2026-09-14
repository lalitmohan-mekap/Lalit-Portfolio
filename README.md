# 🌐 Lalit Mohan Mekap — Portfolio

Personal portfolio website of **Lalit Mohan Mekap**, an AI & Full-Stack Developer based in Bhubaneswar, India.
Showcases machine learning research, software engineering projects, technical skills, and an interactive contact interface.

## 🔗 Live Portfolio

* **[https://lalitmohan-mekap.github.io/Lalit-Portfolio/](https://lalitmohan-mekap.github.io/Lalit-Portfolio/)**

---

## 🚀 Tech Stack

- **Core**: React 19, JavaScript (ESNext), HTML5
- **Build & Tooling**: Vite 8, ESLint (Flat Config)
- **Styling**: Vanilla CSS (modular design system with custom properties & glassmorphism)
- **Animation & Motion**:
  - GSAP 3.14 (ScrollTrigger & ticker synchronization)
  - Framer Motion 12 (Spring physics, 3D perspective transforms & SVG transitions)
  - SplitType (Kinetic typography & text stagger reveals)
  - Lenis (Smooth momentum scrolling)
- **Icons**: Lucide React & custom animated SVGs
- **Services**: Formspree (contact form endpoint)

---

## 📂 Project Structure

```
Lalit-Portfolio/
├── public/
│   ├── images/                 # Project screenshots & portfolio media
│   ├── video/                  # Background tech stack video (video.webm)
│   ├── favicon.svg             # Website favicon
│   └── Lalit_Mohan_Mekap_Resume.pdf
├── src/
│   ├── assets/                 # Local images & static assets
│   ├── components/
│   │   ├── About.jsx           # About bio section with split-text reveal
│   │   ├── AnimatedLogo.jsx    # Custom neon-stroke SVG logo
│   │   ├── Career.jsx          # Scrubbed experience & education timeline
│   │   ├── Contact.jsx         # Contact form with validation & social links
│   │   ├── Cursor.jsx          # Hardware-accelerated cursor & magnetic social dock
│   │   ├── FlowFieldBackground.jsx # HTML5 Canvas trigonometric particle simulation
│   │   ├── Hero.jsx            # Kinetic hero section with glowing portrait
│   │   ├── LocationMap.jsx     # 3D interactive tilt blueprint map widget
│   │   ├── MainContainer.jsx   # Main single-page scroll layout
│   │   ├── MyWorks.jsx         # Full project archive route (/myworks)
│   │   ├── Navbar.jsx          # Glassmorphism header with smooth scroll links
│   │   ├── Preloader.jsx       # Multilingual liquid curtain entrance preloader
│   │   ├── TechStack.jsx       # 6-tier interactive pyramid tech stack
│   │   └── Work.jsx            # Horizontal pinned work showcase
│   ├── data/
│   │   └── config.js           # Central developer data, projects & experiences
│   ├── utils/
│   │   └── animations.js       # GSAP & ScrollTrigger animation utilities
│   ├── App.jsx                 # Route definition (HashRouter)
│   ├── index.css               # Design system tokens & global styling
│   └── main.jsx                # Application root entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## ✨ Key Features

- **Multilingual Curtain Preloader**: Welcomes visitors across multiple languages with dynamic GSAP progress counter and SVG liquid exit animation.
- **Smooth Momentum Scrolling**: Integrated Lenis scroll engine with GSAP ticker synchronization.
- **Hardware-Accelerated Custom Cursor**: Snappy physics-based follower that adapts its shape over interactive targets.
- **Horizontal Pinning Showcase**: Horizontal scroll showcase on desktop with vertical fallback for mobile devices.
- **3D Interactive Blueprint Map**: Spring-based 3D tilt card expanding to show a vector blueprint map of Bhubaneswar.
- **Interactive Particle Flow Field**: Mathematical flow-field canvas simulation with active mouse cursor repulsion on the projects archive page.
- **Direct Contact Integration**: Formspree-powered email form with validation, error shaking, and mailto fallback.

---

## 🛠️ Development & Deployment

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run ESLint check
npm run lint

# Build production bundle
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📬 Contact

- **GitHub**: [https://github.com/lalitmohan-mekap](https://github.com/lalitmohan-mekap)
- **LinkedIn**: [https://linkedin.com/in/lalitmekap](https://linkedin.com/in/lalitmekap)
- **Email**: lalitmohanmekap123@gmail.com

---

## 📜 License

This project is open-source and available under the **MIT License**.
