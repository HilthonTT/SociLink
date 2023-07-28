import { ChangeEvent, useEffect, useState } from "react";
import { IUserEndpoint, UserEndpoint } from "../endpoints/userEndpoint";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { User as IUser } from "../models/user";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegistrationData } from "../form-models/registrationData";
import { IImageData, ImageData } from "../firebase/imageData";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export const Register = () => {
  const userEndpoint: IUserEndpoint = new UserEndpoint();
  const imageData: IImageData = new ImageData();
  const navigate = useNavigate();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required("Your first name is required.")
      .min(2, "Your first name must be at least 2 characters long")
      .max(200, "Your first name must not be above 200 characters long."),
    lastName: yup
      .string()
      .required("Your last name is required.")
      .min(2, "Your last name must be at least 2 characters long")
      .max(200, "Your last name must not be above 200 characters long."),
    displayName: yup
      .string()
      .required("Your display name is required.")
      .min(2)
      .max(80),
    email: yup.string().email().required("Your email is required."),
    password: yup
      .string()
      .matches(
        /^(?=.*[!@#$%^&*])/, // Regular expression for requiring at least one special character
        "Your password must contain a special character."
      )
      .required("Your password is required."),
    confirmedPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match.")
      .required("Please confirm your password."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: yupResolver(schema),
  });

  const onRegistration = async (data: RegistrationData) => {
    try {
      setErrorMessage("");

      const registeredUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const objectIdentifier = registeredUser.user.uid;

      const newUser = new IUser(
        objectIdentifier,
        data.firstName,
        data.lastName,
        data.displayName,
        data.email,
        ""
      );

      if (file) {
        newUser.downloadUrl = await imageData.uploadAsync(file, file.name);
      }

      await userEndpoint.createUserAsync(newUser);

      const signedInUser = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (signedInUser) {
        navigate("/");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      setErrorMessage(errorMessage);
    }
  };

  const handleProfilePicClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fetchedFile = event.target.files?.[0];

    if (fetchedFile) {
      setFile(fetchedFile);
    }
  };

  const getAuthState = () => {
    if (user) {
      navigate("/");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    getAuthState();
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />{" "}
          </Avatar>
        )}

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onRegistration)}
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
                onClick={handleProfilePicClick}>
                Upload profile picture
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                {...register("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                autoComplete="family-name"
                {...register("lastName")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="displayName"
                label="Display Name"
                autoComplete="username"
                {...register("displayName")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirmed-password"
                autoComplete="confirmed-password"
                {...register("confirmedPassword")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
