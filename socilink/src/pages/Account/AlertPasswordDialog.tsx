import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export const AlertPasswordDialog = (props: Props) => {
  const { isOpen, onClose } = props;
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  const handlePasswordReset = async () => {
    if (!user) {
      return;
    }

    await sendPasswordResetEmail(auth, user.email as string);
    handleClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
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
