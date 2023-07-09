import { useEffect, useState } from "react";
import { User } from "./models/user";
import { useAuthHelper } from "./authentication/authHelper";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { getUserFromAuth } = useAuthHelper();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>();

  const getLoggedInUser = async () => {
    const u = await getUserFromAuth();
    console.log(u?.displayName);
    setLoggedInUser(u);
  };

  const loadProfilePage = () => {
    navigate(`/Profile/${loggedInUser?.id}`);
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  return (
    <div>
      <button onClick={loadProfilePage}>Profile</button>
    </div>
  );
};
