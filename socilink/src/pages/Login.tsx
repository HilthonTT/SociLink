import { auth } from "../firebase/firebase";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginData } from "../form-models/loginData";
import { useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
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
    <div>
      <div>{errorMessage && <div>{errorMessage}</div>}</div>
      <div>
        <form onSubmit={handleSubmit(onLogin)}>
          <div>
            <label id="email">Email Address</label>
            <input
              type="text"
              placeholder="Enter your email address"
              {...register("email")}
            />
          </div>
          <div>
            <label id="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};
