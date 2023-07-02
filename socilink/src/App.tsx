import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { SampleData } from "./pages/SampleData";
import { Register } from "./pages/Register";

export const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SampleData" element={<SampleData />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
};
