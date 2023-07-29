import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PasswordResetData } from "../form-models/passwordResetData";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import { FirebaseError } from "firebase/app";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("You must enter your email address.")
      .email("It must be an email address."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetData>({
    resolver: yupResolver(schema),
  });

  const onPasswordResetClick = async (data: PasswordResetData) => {
    try {
      setErrorMessage("");
      await sendPasswordResetEmail(auth, data.email);
    } catch (error: any) {
      if (error.message.includes("auth/user-not-found")) {
        setErrorMessage("No user found with such email address.");
        return;
      }

      setErrorMessage(
        "There was an error while sending an email. Please try again later."
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        navigate("/");
        return;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {errorMessage && (
        <Grid item xs={12} sx={{ marginTop: 8 }}>
          <Alert severity="error">{errorMessage}</Alert>
        </Grid>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <PasswordIcon />{" "}
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot password
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onPasswordResetClick)}
          sx={{ mt: 3 }}>
          <Grid container spacing={2}>
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
            {errors.email && (
              <Grid item xs={12}>
                <Alert severity="error">{errors.email.message}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Send Password Reset Email
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
