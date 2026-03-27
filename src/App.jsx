import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import MyWorks from "./components/MyWorks";

function App() {
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
