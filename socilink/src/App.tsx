import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { SampleData } from "./pages/SampleData";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Create } from "./pages/Create";
import { Details } from "./pages/Details";
import { Profile } from "./pages/Profile";
import { Navbar } from "./Navbar";
import { Container } from "@mui/material";
import {} from "@mui/material/styles";
import { MyThreads } from "./pages/MyThreads";
import { Account } from "./pages/Account/Account";

export const App = () => {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SampleData" element={<SampleData />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/Details/:id" element={<Details />} />
          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/MyThreads" element={<MyThreads />} />
          <Route path="/Account" element={<Account />} />
        </Routes>
      </Container>
    </Router>
  );
};
