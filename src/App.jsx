import { useEffect, lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import MyWorks from "./components/MyWorks";

const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AdminPanel = lazy(() => import("./components/admin/AdminPanel"));

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
        <Route path="/admin" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
        <Route path="/admin/dashboard" element={<Suspense fallback={null}><AdminPanel /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
