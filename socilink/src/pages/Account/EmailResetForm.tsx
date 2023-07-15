import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EmailResetData } from "../../form-models/emailResetData";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export const EmailResetForm = (props: Props) => {
  const { isOpen, onClose } = props;
  const [user] = useAuthState(auth);

  const [open, setOpen] = useState(isOpen);

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  const schema = yup.object().shape({
    currentEmail: yup
      .string()
      .required("You must enter your current email address.")
      .email("It must be an email address."),
    newEmail: yup
      .string()
      .required("You must enter a new email address.")
      .email("It must be an email address."),
    password: yup.string().required("You must enter your password."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailResetData>({
    resolver: yupResolver(schema),
  });

  const handleEmailReset = async (data: EmailResetData) => {
    if (!user) {
      return;
    }

    const credential = await signInWithEmailAndPassword(
      auth,
      data.currentEmail,
      data.password
    );

    await updateEmail(credential.user, data.newEmail);

    await sendEmailVerification(credential.user);

    handleClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(handleEmailReset)}>
        <DialogTitle>Reset Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You must enter your credential to reset your email address.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Current Email Address"
            type="email"
            fullWidth
            variant="standard"
            required
            helperText="Please enter your correct current email address."
            {...register("currentEmail")}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Email Address"
            type="email"
            fullWidth
            variant="standard"
            required
            helperText="Please a correct email address."
            {...register("newEmail")}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            required
            helperText="Please enter your current password."
            {...register("password")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Reset Email</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
