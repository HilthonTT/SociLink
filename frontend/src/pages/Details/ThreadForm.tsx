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
import { Thread } from "../../models/thread";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { UpdateThreadData } from "../../form-models/updateThreadData";
import {
  IThreadEndpoint,
  ThreadEndpoint,
} from "../../endpoints/threadEndpoint";

interface Props {
  isOpen: boolean;
  thread: Thread;
  onClose: (isOpen: boolean) => void;
  setThread: (thread: Thread) => void;
}

export const ThreadForm = (props: Props) => {
  const { isOpen, thread, onClose, setThread } = props;
  const [open, setOpen] = useState(isOpen);

  const threadData: IThreadEndpoint = new ThreadEndpoint();
  const schema = yup.object().shape({
    newThread: yup
      .string()
      .required("You must enter your thread.")
      .min(5, "Your thread must be at least 5 characters long")
      .max(75, "Your thread must not be above 75 characters long."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateThreadData>({
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  const saveNewThread = async (data: UpdateThreadData) => {
    if (data.newThread === "" || data.newThread.length > 75) {
      return;
    }

    const t = thread as Thread;
    t.thread = data.newThread;

    setThread(t);
    await threadData.updateThreadAsync(t);
    handleClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(saveNewThread)}>
        <DialogTitle>Edit Thread</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit your current thread. Everybody will be able see this change. If
            your thread is larger than 75 characters, the changes won't save.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-thread"
            label="New Thread"
            type="text"
            fullWidth
            variant="standard"
            {...register("newThread")}
          />
          {errors?.newThread && (
            <Alert severity="error">{errors.newThread.message}</Alert>
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
