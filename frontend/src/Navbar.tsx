import { useEffect, useState } from "react";
import { User } from "./models/user";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import {
  Avatar,
  Button,
  Container,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { IUserEndpoint, UserEndpoint } from "./endpoints/userEndpoint";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";

enum Pages {
  Home,
  MyThreads,
}

enum SettingsPages {
  Profile,
  Account,
}

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const userEndpoint: IUserEndpoint = new UserEndpoint();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const loadProfilePage = (): void => {
    if (!loggedInUser) {
      return;
    }

    navigate(`/Profile/${loggedInUser._id}`);
  };

  const loadHomePage = (): void => {
    navigate("/");
  };

  const loadMyThreadsPage = (): void => {
    navigate("/MyThreads");
  };

  const loadLogoutPage = (): void => {
    navigate("/Logout");
  };

  const loadLoginPage = (): void => {
    navigate("/Login");
  };

  const loadAccountPage = (): void => {
    navigate("/Account");
  };

  const getPageName = (page: Pages): string => {
    switch (page) {
      case Pages.Home:
        return "Home";
      case Pages.MyThreads:
        return "My Threads";
      default:
        return "";
    }
  };

  const getSettingPageName = (page: SettingsPages): string => {
    switch (page) {
      case SettingsPages.Profile:
        return "Profile";
      case SettingsPages.Account:
        return "Account";
      default:
        return "";
    }
  };

  const loadPages = (page: Pages): void => {
    switch (page) {
      case Pages.Home:
        loadHomePage();
        break;
      case Pages.MyThreads:
        loadMyThreadsPage();
        break;
      default:
        break;
    }

    handleCloseNavMenu();
  };

  const loadAuthPage = (): void => {
    if (user) {
      loadLogoutPage();
    } else {
      loadLoginPage();
    }
  };

  const getAuthPageName = (): string => {
    if (user) {
      return "Logout";
    } else {
      return "Login";
    }
  };

  const loadSettingPages = (page: SettingsPages): void => {
    switch (page) {
      case SettingsPages.Profile:
        loadProfilePage();
        break;
      case SettingsPages.Account:
        loadAccountPage();
        break;
    }

    handleCloseUserMenu();
  };

  const renderLinks = (key: string) => {
    const page = Pages[key as keyof typeof Pages];
    const pageName = getPageName(page);

    if (page === Pages.MyThreads && !loggedInUser) {
      return null;
    }

    return (
      <MenuItem key={page} onClick={() => loadPages(page)}>
        <Typography textAlign="center">{pageName}</Typography>
      </MenuItem>
    );
  };

  const renderLinkButtons = (key: string) => {
    const page = Pages[key as keyof typeof Pages];
    const pageName = getPageName(page);

    if (page === Pages.MyThreads && !loggedInUser) {
      return null;
    }

    return (
      <Button
        key={page}
        onClick={() => loadPages(page)}
        sx={{ my: 2, color: "white", display: "block" }}>
        {pageName}
      </Button>
    );
  };

  useEffect(() => {
    const getLoggedInUser = async () => {
      if (user) {
        const u = await userEndpoint.getUserFromAuth(user?.uid);
        setLoggedInUser(u);
        console.log(loggedInUser);
      }
    };

    getLoggedInUser();
  }, [user]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}>
            SociLink
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}>
              {Object.keys(Pages).map((key) => {
                return renderLinks(key);
              })}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}>
            SociLink
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {Object.keys(Pages).map((key) => {
              return renderLinkButtons(key);
            })}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ marginRight: 1 }}>
                {loggedInUser?.displayName}
              </Typography>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={loggedInUser?.displayName}
                    src={loggedInUser?.downloadUrl}
                  />
                </IconButton>
              </Tooltip>
            </div>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {Object.keys(SettingsPages).map((key) => {
                const page = SettingsPages[key as keyof typeof SettingsPages];
                const pageName = getSettingPageName(page);

                return (
                  <MenuItem key={page} onClick={() => loadSettingPages(page)}>
                    <Typography textAlign="center">{pageName}</Typography>
                  </MenuItem>
                );
              })}
              <MenuItem onClick={loadAuthPage}>
                <Typography textAlign="center">{getAuthPageName()}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
