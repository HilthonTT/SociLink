import { useParams } from "react-router-dom";
import {
  IThreadEndpoint,
  ThreadEndpoint,
} from "../../endpoints/threadEndpoint";
import { SyntheticEvent, useEffect, useState } from "react";
import { Thread } from "../../models/thread";
import { Comment } from "../../models/comment";
import { BasicThread } from "../../models/basicThread";
import { BasicUser } from "../../models/basicUser";
import { User } from "../../models/user";
import {
  CommentEndpoint,
  ICommentEndpoint,
} from "../../endpoints/commentEndpoint";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { IUserEndpoint, UserEndpoint } from "../../endpoints/userEndpoint";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { AccountBox, ModeEdit, Send } from "@mui/icons-material";
import { CustomTabPanel, a11yProps } from "../../components/CustomTabPanel";
import { ThreadForm } from "./ThreadForm";
import { DescriptionForm } from "./DescriptionForm";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

export const Details = () => {
  const { id } = useParams();
  const [user] = useAuthState(auth);

  const threadEndpoint: IThreadEndpoint = new ThreadEndpoint();
  const commentEndpoint: ICommentEndpoint = new CommentEndpoint();
  const userEndpoint: IUserEndpoint = new UserEndpoint();
  const imageWidthHeight = 200;

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [comment, setComment] = useState("");
  const [value, setValue] = useState(0);
  const [threadFormOpen, setThreadFormOpen] = useState(false);
  const [DescriptionFormOpen, setDescriptionFormOpen] = useState(false);

  const handleValueChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onCommentAsync = async () => {
    if (comment === "" || thread === undefined || thread === null) {
      return;
    }

    const basicThread = BasicThread.fromThread(thread as Thread);
    const basicUser = BasicUser.fromUser(loggedInUser as User);

    const newComment = new Comment(comment, basicThread, basicUser);
    comments?.push(newComment);

    await commentEndpoint.createCommentAsync(newComment);
    setComment("");
  };

  const onArchiveCommentAsync = async (comment: Comment) => {
    comment.archived = true;

    await commentEndpoint.updateCommentAsync(comment);

    if (comments) {
      setComments((prevComments) =>
        prevComments ? prevComments.filter((c) => c._id !== comment._id) : null
      );
    }
  };

  const likeThreadAsync = async () => {
    await threadEndpoint.updateVoteThreadAsync(
      thread?._id as string,
      loggedInUser?._id as string
    );

    if (!thread || !loggedInUser) {
      return;
    }

    const updatedThread: Thread = { ...thread } as Thread;

    const userIndex = updatedThread.userVotes.indexOf(
      loggedInUser._id as string
    );

    if (userIndex !== -1) {
      updatedThread.userVotes.splice(userIndex, 1);
    } else {
      updatedThread.userVotes.push(loggedInUser._id as string);
    }

    setThread(updatedThread);
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const u = await userEndpoint.getUserFromAuth(user?.uid);
        setLoggedInUser(u);
      }
    };

    getUser();
  }, [user]);

  useEffect(() => {
    const getThreadAsync = async () => {
      try {
        const fetchedThread = await threadEndpoint.getThreadAsync(id as string);

        setThread(fetchedThread);
      } catch (error) {
        console.log(error);
      }
    };

    getThreadAsync();
  }, [id]);

  useEffect(() => {
    const getThreadCommentsAsync = async () => {
      try {
        const fetchedComments = await commentEndpoint.getThreadCommentsAsync(
          id as string
        );

        setComments(fetchedComments);
      } catch (error) {
        console.log(error);
      }
    };

    getThreadCommentsAsync();
  }, [id]);

  useEffect(() => {
    const dateCreated = thread?.dateCreated;
    const formattedDate = dateCreated
      ? new Date(dateCreated).toLocaleDateString()
      : "N/A";

    setFormattedDate(formattedDate);
  }, [thread]);

  return (
    <Container>
      <CssBaseline />
      <Box
        component="div"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        {thread?.downloadUrl ? (
          <Avatar
            alt={thread.thread}
            src={thread.downloadUrl}
            sx={{ width: imageWidthHeight, height: imageWidthHeight }}
          />
        ) : (
          <Avatar
            sx={{
              m: 1,
              bgcolor: "primary.main",
              width: imageWidthHeight,
              height: imageWidthHeight,
            }}>
            <AccountBox
              sx={{ width: imageWidthHeight / 2, height: imageWidthHeight / 2 }}
            />
          </Avatar>
        )}
        <Tabs
          value={value}
          onChange={handleValueChange}
          aria-label="thread-tabs">
          <Tab label="Thread Information" {...a11yProps(0)} />
          <Tab label="Comments" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography
          component="h2"
          variant="h5"
          className="text-underline"
          sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
          Thread Information
        </Typography>
        <Box
          component="div"
          sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Thread name: {thread?.thread}
          </Typography>
          {thread?.author._id === loggedInUser?._id && (
            <Button
              onClick={() => setThreadFormOpen(true)}
              startIcon={<ModeEdit />}
            />
          )}
        </Box>
        <Box
          component="div"
          sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Author: {thread?.author.displayName}
          </Typography>
        </Box>
        <Box
          component="div"
          sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Date Posted: {formattedDate}
          </Typography>
        </Box>
        <Box component="div" sx={{ justifyContent: "center", display: "flex" }}>
          {thread?.userVotes.find((u) => u === loggedInUser?._id) ? (
            <Button
              startIcon={<ThumbDownAltIcon />}
              color="error"
              variant="contained"
              sx={{ width: "50%", margin: 2 }}
              onClick={likeThreadAsync}
            />
          ) : (
            <Button
              startIcon={<ThumbUpIcon />}
              color="success"
              variant="contained"
              sx={{ width: "50%", margin: 2 }}
              onClick={likeThreadAsync}
            />
          )}
        </Box>
        <Divider sx={{ borderWidth: 2 }} />
        <Box
          component="div"
          sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography
            component="div"
            variant="h6"
            sx={{ wordWrap: "break-word" }}>
            {thread?.description}
          </Typography>
          {thread?.author._id == loggedInUser?._id && (
            <Button
              onClick={() => setDescriptionFormOpen(true)}
              startIcon={<ModeEdit />}
            />
          )}
        </Box>
        <Typography></Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box component="div">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Comment"
            type="text"
            id="comment"
            onChange={(e) => setComment(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={onCommentAsync} edge="end">
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box component="div">
          {comments?.map((c) => (
            <Card key={c._id} sx={{ minWidth: 275, marginBottom: 2 }}>
              <CardContent>
                <Typography variant="body1" component="div">
                  {c.comment}
                  <br />
                  By: {c.author.displayName}
                </Typography>
              </CardContent>
              {c?.author._id === loggedInUser?._id && (
                <CardActions>
                  <Button size="small">Edit</Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onArchiveCommentAsync(c)}>
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      </CustomTabPanel>

      <ThreadForm
        isOpen={threadFormOpen}
        thread={thread as Thread}
        onClose={() => setThreadFormOpen(false)}
        setThread={setThread}
      />

      <DescriptionForm
        isOpen={DescriptionFormOpen}
        thread={thread as Thread}
        onClose={() => setDescriptionFormOpen(false)}
        setThread={setThread}
      />
    </Container>
  );
};
