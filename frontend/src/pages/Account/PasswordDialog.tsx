import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { IUserEndpoint, UserEndpoint } from "../../endpoints/userEndpoint";
import { User } from "../../models/user";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export const PasswordDialog = (props: Props) => {
  const { isOpen, onClose } = props;

  const userEndpoint: IUserEndpoint = new UserEndpoint();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<User | null>();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  const handlePasswordReset = async () => {
    if (!loggedInUser) {
      return;
    }

    await sendPasswordResetEmail(auth, loggedInUser.email as string);
    handleClose();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
        return;
      }

      const u = await userEndpoint.getUserFromAuth(currentUser?.uid);
      setLoggedInUser(u);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Reset your password?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We will send an email to you to reset your password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePasswordReset} autoFocus>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
