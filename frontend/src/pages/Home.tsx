import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { Category } from "../models/category";
import { IThreadEndpoint, ThreadEndpoint } from "../endpoints/threadEndpoint";
import {
  CategoryEndpoint,
  ICategoryEndpoint,
} from "../endpoints/categoryEndpoint";
import { useNavigate } from "react-router-dom";
import { User } from "../models/user";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { auth } from "../firebase/firebase";
import { IUserEndpoint, UserEndpoint } from "../endpoints/userEndpoint";
import { onAuthStateChanged } from "firebase/auth";

export const Home = () => {
  const threadEndpoint: IThreadEndpoint = new ThreadEndpoint();
  const categoryEndpoint: ICategoryEndpoint = new CategoryEndpoint();
  const userEndpoint: IUserEndpoint = new UserEndpoint();

  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const openDetails = (thread: Thread) => {
    navigate(`Details/${thread._id}`);
  };

  const loadMyThreadsPage = () => {
    navigate("/MyThreads");
  };

  const loadCreatePage = () => {
    navigate("/Create");
  };

  const onCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const u = await userEndpoint.getUserFromAuth(currentUser?.uid);
      setLoggedInUser(u);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchThreadsAsync = async () => {
      const threads = await threadEndpoint.getThreadsAsync();
      setThreads(threads);
    };

    fetchThreadsAsync();
  }, []);

  useEffect(() => {
    const fetchCategoriesAsync = async () => {
      const categories = await categoryEndpoint.getCategoriesAsync();
      setCategories(categories);
    };

    fetchCategoriesAsync();
  }, []);

  return (
    <div>
      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}>
          <Container maxWidth="lg">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom>
              Threads
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph>
              Welcome to the current threads page! Here, you'll find a
              collection of ongoing discussions created by our diverse
              community. Show respect for each post and engage in meaningful
              conversations. Together, let's make this space a valuable hub of
              ideas and insights.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center">
              <Button variant="contained" onClick={loadCreatePage}>
                Make a thread
              </Button>
              <Button variant="outlined" onClick={loadMyThreadsPage}>
                My Threads
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {threads?.map((thread) => (
              <Grid item key={thread._id} xs={12} sm={6} md={4}>
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
                    {loggedInUser?._id === (thread.author?._id as string) && (
                      <Button size="small">Edit</Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </div>
  );
};
