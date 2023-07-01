import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { SampleData } from "./pages/SampleData";

export const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/SampleData" element={<SampleData />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};
