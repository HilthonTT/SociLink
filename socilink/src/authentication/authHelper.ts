import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { User } from "../models/user";
import { IUserData, UserData } from "../data/userData";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const useAuthHelper = () => {
  const navigate = useNavigate();
  const userData: IUserData = new UserData();

  const [user, setUser] = useState<User | null>(null);

  const getUserFromAuth = async (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userFromAuth = await userData.getUserFromAuth(user.uid);
          setUser(userFromAuth);
          resolve(userFromAuth);
        } else {
          navigate("/Login");
          setUser(null);
          resolve(null);
        }
      });
    });
  };

  useEffect(() => {
    getUserFromAuth();
  }, []);

  return { getUserFromAuth };
};
