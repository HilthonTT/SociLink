import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Logout = () => {
  const navigate = useNavigate();

  const refreshPage = () => {
    window.location.reload();
  };

  const logOut = async () => {
    await signOut(auth);
    navigate("/");
    refreshPage();
  };

  useEffect(() => {
    logOut();

    //eslint-disable-next-line
  }, []);

  return <div></div>;
};

export {};
