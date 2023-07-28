import { useEffect, useState } from "react";
import { User } from "../../models/user";
import { onAuthStateChanged } from "firebase/auth";
import { IUserEndpoint, UserEndpoint } from "../../endpoints/userEndpoint";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DisplayNameData } from "../../form-models/displayNameData";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Props {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export const DisplayNameDialog = (props: Props) => {
  const { isOpen, onClose } = props;

  const userEndpoint: IUserEndpoint = new UserEndpoint();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<User | null>();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  const schema = yup.object().shape({
    displayName: yup
      .string()
      .required("You must enter your display name.")
      .min(2)
      .max(80),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DisplayNameData>({
    resolver: yupResolver(schema),
  });

  const handleUsernameReset = async (data: DisplayNameData) => {
    if (!loggedInUser) {
      return;
    }

    const user = { ...loggedInUser } as User;
    user.displayName = data.displayName;

    await userEndpoint.updateUser(user);
    handleClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

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

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(handleUsernameReset)}>
        <DialogTitle>Change Display Name</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your new display name.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Display Name"
            type="text"
            fullWidth
            variant="standard"
            required
            helperText="Please enter your new display name."
            {...register("displayName")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Change username</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
