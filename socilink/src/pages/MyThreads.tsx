import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { IThreadData, ThreadData } from "../data/threadData";
import { User } from "../models/user";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { IUserData, UserData } from "../data/userData";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const MyThreads = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const threadData: IThreadData = new ThreadData();
  const userData: IUserData = new UserData();

  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [filteredThreads, setFilteredThreads] = useState<Thread[] | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const openDetails = (thread: Thread) => {
    navigate(`Details/${thread.id}`);
  };

  const filterThreads = (searchText: string) => {
    if (!threads) {
      return;
    }

    let output = threads;

    if (searchText.trim() !== "") {
      output = output.filter(
        (thread) =>
          thread.thread.toLowerCase().includes(searchText.toLowerCase()) ||
          thread.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredThreads(output);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    filterThreads(searchText);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const u = await userData.getUserFromAuth(user.uid);
        setLoggedInUser(u);
      }
    };

    fetchData();
  }, [user, userData]);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedInUser) {
        const userThreads = await threadData.getUserThreadAsync(
          loggedInUser.id
        );
        setThreads(userThreads);
        setFilteredThreads(userThreads);
      }
    };

    fetchData();
  }, [loggedInUser, threadData]);

  return (
    <div>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom>
          My Threads
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph>
          Welcome to your created threads section! Here, you have full control
          over your discussions. Explore, modify, and search through your
          threads to your heart's content. This space is designed for you to
          curate and curate meaningful conversations. Let your ideas and
          insights shine as you shape and develop your threads into valuable
          hubs of knowledge and interaction.
        </Typography>

        <Stack sx={{ justifyContent: "center" }}>
          {threads && (
            <Autocomplete
              id="search-your-threads"
              freeSolo
              options={threads.map((t) => t.thread)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search your threads"
                  onChange={handleInputChange}
                />
              )}
              sx={{ marginLeft: "auto", marginRight: "auto", width: 500 }}
            />
          )}
        </Stack>
      </Box>
      <Container>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {filteredThreads?.map((thread) => (
              <Grid item key={thread.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={thread?.downloadUrl}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {thread.thread}
                    </Typography>
                    <Typography>{thread.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => openDetails(thread)}>
                      View
                    </Button>
                    {loggedInUser?.id === (thread.author?.id as string) && (
                      <Button size="small">Edit</Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </div>
  );
};
