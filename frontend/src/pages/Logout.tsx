import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Logout = () => {
  const navigate = useNavigate();

  const logOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    logOut();
  }, []);

  return <div></div>;
};

export {};
