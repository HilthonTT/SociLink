import { useNavigate, useParams } from "react-router-dom";
import { IThreadData, ThreadData } from "../data/threadData";
import {
  Fragment,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { Thread } from "../models/thread";
import { Comment } from "../models/comment";
import { BasicThread } from "../models/basicThread";
import { BasicUser } from "../models/basicUser";
import { User } from "../models/user";
import { CommentData, ICommentData } from "../data/commentData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { IUserData, UserData } from "../data/userData";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  CssBaseline,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { AccountBox, ModeEdit, Send } from "@mui/icons-material";

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
    id: `thread-tab-${index}`,
    "aria-controls": `thread-tabpanel-${index}`,
  };
}

export const Details = () => {
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const threadData: IThreadData = new ThreadData();
  const commentData: ICommentData = new CommentData();
  const userData: IUserData = new UserData();
  const imageWidthHeight = 200;

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [comment, setComment] = useState("");
  const [value, setValue] = useState(0);

  const getThreadAsync = async () => {
    const fetchedThread = await threadData.getThreadAsync(id as string);

    if (fetchedThread === null) {
      return;
    }

    setThread(fetchedThread);
  };

  const handleValueChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getThreadCommentsAsync = async () => {
    const fetchedComments = await commentData.getThreadCommentsAsync(
      id as string
    );

    setComments(fetchedComments);
  };

  const onCommentAsync = async () => {
    if (comment === "" || thread === undefined || thread === null) {
      return;
    }

    const basicThread = BasicThread.fromThread(thread as Thread);
    const basicUser = BasicUser.fromUser(loggedInUser as User);

    const newComment = new Comment(comment, basicThread, basicUser);
    comments?.push(newComment);

    await commentData.createCommentAsync(newComment);
    setComment("");
  };

  const closePage = () => {
    navigate("/");
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const u = await userData.getUserFromAuth(user?.uid);
        setLoggedInUser(u);
      }
    };

    getUser();
  }, [user, userData]);

  useEffect(() => {
    getThreadAsync();
  }, [id]);

  useEffect(() => {
    getThreadCommentsAsync();
  }, [comments]);

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
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Thread name: {thread?.thread}
          </Typography>
          {thread?.author.id === loggedInUser?.id && (
            <Button startIcon={<ModeEdit />} />
          )}
        </Box>
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Author: {thread?.author.displayName}
          </Typography>
        </Box>
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography component="div" variant="h6">
            Date Posted: {thread?.dateCreated.toDate().toLocaleDateString()}
          </Typography>
        </Box>
        <Divider sx={{ borderWidth: 2 }} />
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <Typography
            component="div"
            variant="h6"
            sx={{ wordWrap: "break-word" }}>
            {thread?.description}
          </Typography>
          {thread?.author.id === loggedInUser?.id && (
            <Button startIcon={<ModeEdit />} />
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
            <Card key={c.id} sx={{ minWidth: 275, marginBottom: 2 }}>
              <CardContent>
                <Typography variant="body1" component="div">
                  {c.comment}
                  <br />
                  By: {c.author.displayName}
                </Typography>
              </CardContent>
              {c?.author.id === loggedInUser?.id && (
                <CardActions>
                  <Button size="small">Edit</Button>
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      </CustomTabPanel>
    </Container>
  );
};
