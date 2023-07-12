import { useEffect, useState } from "react";
import { User } from "../models/user";
import { Thread } from "../models/thread";
import { useNavigate, useParams } from "react-router-dom";
import { IUserData, UserData } from "../data/userData";
import { IThreadData, ThreadData } from "../data/threadData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

export const Profile = () => {
  const { id } = useParams();
  const [user] = useAuthState(auth);

  const userData: IUserData = new UserData();
  const threadData: IThreadData = new ThreadData();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<Thread[] | null>(null);

  const getThreadText = () => {
    if (!profileUser) {
      return "";
    }

    const username = profileUser?.displayName;
    const threadCount = profileUser?.authoredComments.length;

    if (threadCount <= 0) {
      return `${username} has authored no threads.`;
    } else if (threadCount === 1) {
      return `${username} has authored 1 thread.`;
    } else {
      return `${username} has authored ${threadCount} threads.`;
    }
  };

  const closePage = () => {
    navigate("/");
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const u = await userData.getUserAsync(user.uid);
        setLoggedInUser(u);
      }
    };

    getUser();
  }, [user, userData]);

  useEffect(() => {
    const getProfileUser = async () => {
      const user = await userData.getUserAsync(id as string);
      setProfileUser(user);
    };

    getProfileUser();
  }, [id]);

  useEffect(() => {
    const getThreads = async () => {
      const fetchedThreads = await threadData.getUserThreadAsync(id as string);
      setThreads(fetchedThreads);
    };

    getThreads();
  }, [id]);

  return (
    <div>
      <div>
        <button onClick={closePage}>Close Page</button>
      </div>
      <div>
        {profileUser?.downloadUrl && <img src={profileUser?.downloadUrl} />}
      </div>
      <div>{profileUser?.displayName}</div>
      <div>{getThreadText()}</div>
      <br />
      <hr />
      <br />
      <div>
        <ul>
          {threads?.map((t) => (
            <li>
              {t.thread} - {t.dateCreated.toDate().toUTCString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
