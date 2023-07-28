import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SampleData } from "./pages/SampleData";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Create } from "./pages/Create";
import { Details } from "./pages/Details/Details";
import { Profile } from "./pages/Profile";
import { Navbar } from "./Navbar";
import { Box, Container, Link, Typography } from "@mui/material";
import {} from "@mui/material/styles";
import { MyThreads } from "./pages/MyThreads";
import { Account } from "./pages/Account/Account";
import { ForgotPassword } from "./pages/ForgotPassword";

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Socilink
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

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
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/Details/:id" element={<Details />} />
          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/MyThreads" element={<MyThreads />} />
          <Route path="/Account" element={<Account />} />
        </Routes>
      </Container>
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          SociLink
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p">
          © {new Date().getFullYear()} SociLink Corporation. Socilink, is among
          the registered and unregistered websites
        </Typography>
        <Copyright />
      </Box>
    </Router>
  );
};
