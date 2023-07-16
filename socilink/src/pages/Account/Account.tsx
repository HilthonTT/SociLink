import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { User } from "../../models/user";
import { IUserData, UserData } from "../../data/userData";
import { EmailResetForm } from "./EmailResetForm";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { AccountBox, ModeEdit } from "@mui/icons-material";
import { AlertPasswordDialog } from "./AlertPasswordDialog";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `account-tab-${index}`,
    "aria-controls": `account-tabpanel-${index}`,
  };
}

export const Account = () => {
  const [user] = useAuthState(auth);
  const userData: IUserData = new UserData();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [value, setValue] = useState(0);
  const [resetEmail, setResetEmail] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);

  const handleValueChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getLoggedInUser = async () => {
      if (user) {
        const u = await userData.getUserFromAuth(user?.uid);
        setLoggedInUser(u);
      }
    };

    getLoggedInUser();
  }, [user, userData]);

  return (
    <Container>
      <CssBaseline />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 100, height: 100 }}>
          <AccountBox sx={{ width: 50, height: 50 }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Account
        </Typography>
        <Tabs
          value={value}
          onChange={handleValueChange}
          aria-label="account-tabs">
          <Tab label="Account Information" {...a11yProps(0)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography
          component="h2"
          variant="h5"
          className="text-underline"
          sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
          Account Information
        </Typography>
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Display Name: {loggedInUser?.displayName}
          </Typography>
          <Button startIcon={<ModeEdit />} />
        </Box>
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Email Address: {loggedInUser?.email}
          </Typography>
          <Button
            startIcon={<ModeEdit />}
            onClick={() => setResetEmail(true)}
          />
        </Box>
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Password: **********
          </Typography>
          <Button
            startIcon={<ModeEdit />}
            onClick={() => setResetPassword(true)}
          />
        </Box>
        <Typography></Typography>
      </CustomTabPanel>

      <EmailResetForm
        isOpen={resetEmail}
        onClose={() => setResetEmail(false)}
      />

      <AlertPasswordDialog
        isOpen={resetPassword}
        onClose={() => setResetPassword(false)}
      />
    </Container>
  );
};
