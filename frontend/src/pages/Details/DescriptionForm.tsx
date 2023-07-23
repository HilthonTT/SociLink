import { useEffect, useState } from "react";
import { Thread } from "../../models/thread";
import {
  IThreadEndpoint,
  ThreadEndpoint,
} from "../../endpoints/threadEndpoint";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { UpdateDescriptionData } from "../../form-models/updateDescriptionData";
import {
  Alert,
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
  thread: Thread;
  onClose: (isOpen: boolean) => void;
  setThread: (thread: Thread) => void;
}

export const DescriptionForm = (props: Props) => {
  const { isOpen, thread, onClose, setThread } = props;
  const [open, setOpen] = useState(isOpen);

  const threadEndpoint: IThreadEndpoint = new ThreadEndpoint();

  const schema = yup.object().shape({
    newDescription: yup
      .string()
      .required("You must enter your description.")
      .min(5, "Your description must be at least 5 characters long")
      .max(500, "Your description must not be above 500 characters long."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDescriptionData>({
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  const saveNewDescription = async (data: UpdateDescriptionData) => {
    if (data.newDescription === "" || data.newDescription.length > 500) {
      return;
    }

    const t = thread as Thread;
    t.description = data.newDescription;

    setThread(t);
    await threadEndpoint.updateThreadAsync(t);
    handleClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(saveNewDescription)}>
        <DialogTitle>Edit Description</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit your current description. Everybody will be able see this
            change. If your description is larger than 500 characters, the
            changes won't save.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-description"
            label="New Description"
            type="text"
            fullWidth
            variant="standard"
            multiline
            {...register("newDescription")}
          />
          {errors?.newDescription && (
            <Alert severity="error">{errors.newDescription.message}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
