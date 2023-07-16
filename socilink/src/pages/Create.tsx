import { useNavigate } from "react-router-dom";
import { IThreadData, ThreadData } from "../data/threadData";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateData } from "../form-models/createData";
import { Category } from "../models/category";
import { CategoryData, ICategoryData } from "../data/categoryData";
import { Thread } from "../models/thread";
import { BasicUser } from "../models/basicUser";
import { User } from "../models/user";
import { IImageData, ImageData } from "../data/imageData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { IUserData, UserData } from "../data/userData";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Create as CreateIcon } from "@mui/icons-material";

export const Create = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const threadData: IThreadData = new ThreadData();
  const categoryData: ICategoryData = new CategoryData();
  const imageData: IImageData = new ImageData();
  const userData: IUserData = new UserData();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[] | null>();
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const schema = yup.object().shape({
    thread: yup
      .string()
      .required("You cannot create a thread without a thread!")
      .min(5, "Your thread must be at least 5 characters long")
      .max(75, "Your thread must not be above 75 characters long."),
    description: yup
      .string()
      .required("You cannot creata a thread without a description.")
      .min(5, "Your description must be at least 5 characters long.")
      .max(500, "Your description must not be above 500 characters long."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateData>({
    resolver: yupResolver(schema),
  });

  const handleButtonClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const onCategoryChange = (event: SelectChangeEvent) => {
    setCategoryId(event.target.value);
  };

  const getCategoriesAsync = async () => {
    const categories = await categoryData.getCategoriesAsync();
    setCategories(categories);
  };

  const onCreateThreadAsync = async (data: CreateData) => {
    try {
      setErrorMessage("");
      if (loggedInUser === undefined || loggedInUser === null) {
        setErrorMessage("You are not logged in.");
        return;
      }

      const author = BasicUser.fromUser(loggedInUser as User) as BasicUser;
      const thread = new Thread(
        data.thread,
        data.description,
        new Category("", ""),
        "",
        author
      );

      thread.category = categories?.find(
        (c) => c.id === categoryId
      ) as Category;

      if (thread.category === null || thread.category === undefined) {
        setCategoryId("");
        return;
      }

      if (file) {
        const downloadUrl = await imageData.uploadAsync(file, file.name);
        thread.downloadUrl = downloadUrl;
      }

      await threadData.createThreadAsync(thread);
      closePage();
    } catch {
      setErrorMessage("Something went wrong while uploading your thread.");
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fetchedFile = event.target.files?.[0];

    if (fetchedFile) {
      setFile(fetchedFile);
    }
  };

  const closePage = () => {
    navigate("/");
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const u = await userData.getUserFromAuth(user.uid);
        setLoggedInUser(u);
      }
    };

    getUser();
  }, [user, userData]);

  useEffect(() => {
    getCategoriesAsync();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        {file ? (
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={URL.createObjectURL(file)}
            alt="profile picture"
          />
        ) : (
          <Avatar
            sx={{ m: 1, bgcolor: "primary.main", width: 100, height: 100 }}>
            <CreateIcon sx={{ width: 50, height: 50 }} />{" "}
          </Avatar>
        )}
        <Typography component="h1" variant="h5">
          Make a Thread
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onCreateThreadAsync)}
          sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={onFileChange}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handleButtonClick}>
                Upload picture
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="thread-title"
                label="Thread"
                helperText="Summarize your thread in less than 75 characters."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="thread-description"
                label="Description"
                helperText="Describe your thread in less than 500 characters"
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Category"
                  value={categoryId}
                  onChange={onCategoryChange}
                  fullWidth>
                  {categories?.map((cat) => (
                    <MenuItem value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
