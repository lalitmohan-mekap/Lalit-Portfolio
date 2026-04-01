import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import MyWorks from "./components/MyWorks";

function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContainer />} />
        <Route path="/myworks" element={<MyWorks />} />
      </Routes>
    </Router>
  );
}

export default App;
