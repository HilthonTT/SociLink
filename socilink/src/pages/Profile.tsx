import { useEffect, useState } from "react";
import { User } from "../models/user";
import { Thread } from "../models/thread";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthHelper } from "../authentication/authHelper";
import { IUserData, UserData } from "../data/userData";
import { IThreadData, ThreadData } from "../data/threadData";

export const Profile = () => {
  const { id } = useParams();
  const { getUserFromAuth } = useAuthHelper();

  const userData: IUserData = new UserData();
  const threadData: IThreadData = new ThreadData();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<Thread[] | null>(null);

  const getUser = async () => {
    const user = await getUserFromAuth();
    setLoggedInUser(user);
  };

  const getProfileUser = async () => {
    const user = await userData.getUserAsync(id as string);
    setUser(user);
  };

  const getThreads = async () => {
    const fetchedThreads = await threadData.getUserThreadAsync(id as string);
    setThreads(fetchedThreads);
  };

  const closePage = () => {
    navigate("/");
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getProfileUser();
  }, []);

  useEffect(() => {
    getThreads();
  }, []);

  return <div></div>;
};
