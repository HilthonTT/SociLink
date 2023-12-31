import { auth } from "../firebase/firebase";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginData } from "../form-models/loginData";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertTitle } from "@mui/material";

export const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("You must enter your email address.")
      .email("It must be an email address."),
    password: yup.string().required("You must enter your password."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const onLogin = async (data: LoginData) => {
    try {
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

  const loadRegisterPage = () => {
    navigate("/Register");
  };

  const loadForgotPasswordPage = () => {
    navigate("/ForgotPassword");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/");
      }
    });

    return () => unsubscribe();
    //eslint-disable-next-line
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            marginTop: 2,
          }}>
          <AlertTitle>Error logging in!</AlertTitle>
          <div>{errorMessage}</div>
        </Alert>
      )}
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onLogin)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register("email")}
          />
          {errors.email && (
            <Alert severity="error">{errors.email.message}</Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <Alert severity="error">{errors.password.message}</Alert>
          )}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link onClick={loadForgotPasswordPage} variant="body2" href="">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link variant="body2" onClick={loadRegisterPage} href="">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
