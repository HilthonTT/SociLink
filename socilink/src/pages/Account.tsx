import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import { IUserData, UserData } from "../data/userData";
import {
  sendPasswordResetEmail,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EmailResetData } from "../form-models/emailResetData";

export const Account = () => {
  const [user] = useAuthState(auth);
  const userData: IUserData = new UserData();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("You must enter an email address.")
      .email("It must be an email address."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailResetData>({
    resolver: yupResolver(schema),
  });

  const handlePasswordReset = async () => {
    if (!user) {
      return;
    }

    await sendPasswordResetEmail(auth, user.email as string);
  };

  const handleEmailReset = async (data: EmailResetData) => {
    if (!user) {
      return;
    }

    await updateEmail(user, data.email);
    await sendEmailVerification(user);
  };

  useEffect(() => {
    const getLoggedInUser = async () => {
      if (user) {
        const u = await userData.getUserAsync(user?.uid);
        setLoggedInUser(u);
      }
    };

    getLoggedInUser();
  }, [user, userData]);

  return (
    <div>
      <div></div>
    </div>
  );
};
