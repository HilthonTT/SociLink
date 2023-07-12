import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { IThreadData, ThreadData } from "../data/threadData";
import { User } from "../models/user";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { IUserData, UserData } from "../data/userData";

export const MyThreads = () => {
  const [user] = useAuthState(auth);

  const threadData: IThreadData = new ThreadData();
  const userData: IUserData = new UserData();

  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const u = await userData.getUserFromAuth(user.uid);
        setLoggedInUser(u);
      }
    };

    fetchData();
  }, [user, userData]);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedInUser) {
        const userThreads = await threadData.getUserThreadAsync(
          loggedInUser.id
        );
        setThreads(userThreads);
      }
    };

    fetchData();
  }, [loggedInUser, threadData]);

  return (
    <div>
      <h1>My Threads</h1>
      <div>
        {user?.displayName}
        {threads?.map((t) => (
          <div key={t.id}>{t.thread}</div>
        ))}
      </div>
    </div>
  );
};
