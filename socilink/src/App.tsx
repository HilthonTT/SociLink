import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { SampleData } from "./pages/SampleData";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Create } from "./pages/Create";
import { Details } from "./pages/Details";

export const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SampleData" element={<SampleData />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/Details/:id" element={<Details />} />
        </Routes>
      </Router>
    </div>
  );
};
