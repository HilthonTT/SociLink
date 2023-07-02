import { useEffect, useState } from "react";
import { IUserData, UserData } from "../data/userData";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { User } from "../models/user";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegistrationData } from "../form-models/registrationData";

export const Register = () => {
  const userData: IUserData = new UserData();
  const navigate = useNavigate();

  const [user] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required("Your first name is required.")
      .min(5, "Your first name must be at least 5 characters")
      .max(100, "Your first name must not be above 100 characters."),
    lastName: yup
      .string()
      .required("Your last name is required")
      .min(5, "Your last name must be at least 5 characters")
      .max(100, "Your last name must not be above 100 characters."),
    displayName: yup.string().required("Your display name is required"),
    email: yup.string().email().required("Your email is required"),
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
        email,
        password
      );

      const objectIdentifier = registeredUser.user.uid;

      const newUser = new User(
        objectIdentifier,
        firstName,
        lastName,
        displayName,
        email,
        ""
      );

      await userData.createUserAsync(newUser);

      navigate("/");
    } catch (error) {
      setErrorMessage(error as string);
    }
  };

  const getAuthState = () => {
    if (user) {
      navigate("/");
    }
  };

  useEffect(() => {
    getAuthState();
  }, [user]);

  return <div></div>;
};
