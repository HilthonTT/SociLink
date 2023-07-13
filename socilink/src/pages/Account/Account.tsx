import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "../../models/user";
import { IUserData, UserData } from "../../data/userData";
import { EmailResetForm } from "./EmailResetForm";
import { PasswordResetForm } from "./PasswordResetForm";

export const Account = () => {
  const [user] = useAuthState(auth);
  const userData: IUserData = new UserData();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const getLoggedInUser = async () => {
      if (user) {
        const u = await userData.getUserFromAuth(user?.uid);
        setLoggedInUser(u);
      }
    };

    getLoggedInUser();
  }, [user, userData]);

  return (
    <div>
      <div>
        <h1>Account</h1>
      </div>
      <div>
        <div>Email: {loggedInUser?.email}</div>
        <div>Display Name: {loggedInUser?.displayName}</div>
        <div>
          Hello {loggedInUser?.firstName} {loggedInUser?.lastName}
        </div>
        <div>
          You have posted {loggedInUser?.authoredThreads.length} threads.
        </div>
        <hr />
        <div>
          <EmailResetForm />
        </div>
        <hr />
        <div>
          <PasswordResetForm />
        </div>
      </div>
    </div>
  );
};
