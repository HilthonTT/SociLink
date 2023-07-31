import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { Category } from "../models/category";
import { IThreadEndpoint, ThreadEndpoint } from "../endpoints/threadEndpoint";
import {
  CategoryEndpoint,
  ICategoryEndpoint,
} from "../endpoints/categoryEndpoint";
import { useNavigate } from "react-router-dom";
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
import { onAuthStateChanged } from "firebase/auth";
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import BusinessIcon from '@mui/icons-material/Business';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import BorderClearIcon from '@mui/icons-material/BorderClear';

export const Home = () => {
  const threadEndpoint: IThreadEndpoint = new ThreadEndpoint();
  const categoryEndpoint: ICategoryEndpoint = new CategoryEndpoint();

  const navigate = useNavigate();
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

  const onCategoryClick = async (category: Category | null) => {
    setSelectedCategory(category);
    await filterThreads();
  };

  const filterThreads = async () => {
    const allThreads = await threadEndpoint.getThreadsAsync();

    if (!selectedCategory) {
      setThreads(allThreads);
      return;
    }

    const filteredThreads = allThreads.filter((thread) => {
      return (
        thread.category.name === selectedCategory.name || thread.category._id === selectedCategory._id
      );
    });

    setThreads(filteredThreads);
  }

  const getListItemAvatar = (category: Category | null) => {
    if (!category) {
      return <BorderClearIcon />;
    }

    switch (category.name) {
      case "Gaming":
        return <SportsEsportsIcon />;
      case "Sports":
        return <SportsScoreIcon />;
      case "Business":
        return <BusinessIcon />;
      case "Crypto":
        return <CurrencyBitcoinIcon />;
      default:
        return <BorderClearIcon />;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
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

  useEffect(() => {
    filterThreads();
  }, [selectedCategory]);

  return (
    <div>
      <CssBaseline />
      <main>
        <Box
          display="flex"
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader component="div" id="category-list-subheader">
                Categories
              </ListSubheader>
            }>
            <ListItemButton
              selected={selectedCategory?._id === ""}
              onClick={() => onCategoryClick(null)}
              sx={{ cursor: "pointer" }}>
              <ListItemAvatar>
                <Avatar>
                  {getListItemAvatar(null)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="All"
                secondary="Select all the threads." />
            </ListItemButton>
            {categories?.map((cat) => (
              <ListItemButton
                key={cat._id}
                selected={selectedCategory?._id === cat._id}
                onClick={() => onCategoryClick(cat)}
                sx={{ cursor: "pointer" }}>
                <ListItemAvatar>
                  <Avatar>
                    {getListItemAvatar(cat)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={cat.name}
                  secondary={cat.description} />
              </ListItemButton>
            ))}
          </List>
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
