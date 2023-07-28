import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PasswordResetData } from "../form-models/passwordResetData";

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
    } catch (error) {
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

  return <div></div>;
};
