import { useEffect, useState } from "react";
import { IUserData, UserData } from "../data/userData";
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
import { IImageData, ImageData } from "../data/imageData";

export const Register = () => {
  const userData: IUserData = new UserData();
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
    displayName: yup.string().required("Your display name is required."),
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

      await userData.createUserAsync(newUser);

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

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [user]);

  return (
    <div>
      {errorMessage && <div>{errorMessage}</div>}
      <div>
        <form onSubmit={handleSubmit(onRegistration)}>
          <div>
            <label id="profile-picture">Profile Picture</label>
            <input type="file" onChange={onFileChange} />
          </div>
          <div>
            <label id="first-name">First Name</label>
            <input
              id="first-name"
              placeholder="Enter your first name"
              {...register("firstName")}
            />
            {errors.firstName?.message}
          </div>
          <div>
            <label id="last-name">Last Name</label>
            <input
              id="last-name"
              placeholder="Enter your last name"
              {...register("lastName")}
            />
            {errors.lastName?.message}
          </div>
          <div>
            <label id="display-name">Display Name</label>
            <input
              id="display-name"
              placeholder="Enter your display name"
              {...register("displayName")}
            />
            {errors.displayName?.message}
          </div>
          <div>
            <label id="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
            />
            {errors.email?.message}
          </div>
          <div>
            <label id="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password?.message}
          </div>
          <div>
            <label id="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Enter your password again to confirm"
              {...register("confirmedPassword")}
            />
            {errors.confirmedPassword?.message}
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};
