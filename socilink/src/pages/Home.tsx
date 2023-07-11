import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { Category } from "../models/category";
import { IThreadData, ThreadData } from "../data/threadData";
import { CategoryData, ICategoryData } from "../data/categoryData";
import { useAuthHelper } from "../authentication/authHelper";
import { useNavigate } from "react-router-dom";
import { User } from "../models/user";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

export const Home = () => {
  const { getUserFromAuth } = useAuthHelper();

  const threadData: IThreadData = new ThreadData();
  const categoryData: ICategoryData = new CategoryData();

  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const openDetails = (thread: Thread) => {
    navigate(`Details/${thread.id}`);
  };

  const getThreadsAsync = async () => {
    const threads = await threadData.getThreadsAsync();
    setThreads(threads);
  };

  const getCategoriesAsync = async () => {
    const categories = await categoryData.getCategoriesAsync();
    setCategories(categories);
  };

  const onCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const getUser = async () => {
    const user = await getUserFromAuth();
    setLoggedInUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getThreadsAsync();
  }, []);

  useEffect(() => {
    getCategoriesAsync();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <Paper elevation={2} className="categoryList">
          <List component="nav">
            {categories?.map((category) => (
              <ListItem key={category.id}>
                <ListItemText>{category.name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div className="threadsContainer">
          {threads?.map((thread) => (
            <Card sx={{ maxWidth: 345 }}>
              {thread.downloadUrl ? (
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image={thread.downloadUrl}
                />
              ) : (
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image="https://dummyimage.com/600x400/000/fff"
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {thread.thread}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};
