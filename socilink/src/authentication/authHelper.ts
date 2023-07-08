import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { User } from "../models/user";
import { IUserData, UserData } from "../data/userData";
import { useEffect } from "react";

export interface IAuthHelper {
  getAuthState: () => Promise<User | null>;
}

export class AuthHelper implements IAuthHelper {
  private readonly navigate = useNavigate();
  private readonly userData: IUserData = new UserData();

  public getAuthState = async (): Promise<User | null> => {
    const [user] = useAuthState(auth);

    if (user === null) {
      this.navigate("/Login");
      return null;
    }

    const userFromAuth = this.userData.getUserFromAuth(user?.uid as string);
    return userFromAuth;
  };
}

export const useAuthHelper = () => {
  const navigate = useNavigate();
  const userData: IUserData = new UserData();
  const [user] = useAuthState(auth);

  useEffect(() => {
    getUserFromAuth();
  }, []);

  const getUserFromAuth = async () => {
    if (user === null) {
      navigate("/Login");
      return null;
    }

    const userFromAuth = await userData.getUserFromAuth(user?.uid as string);
    return userFromAuth;
  };

  return { getUserFromAuth };
};
