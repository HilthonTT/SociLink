import { useEffect, useState } from "react";
import {
  CategoryEndpoint,
  ICategoryEndpoint,
} from "../endpoints/categoryEndpoint";
import { IUserEndpoint, UserEndpoint } from "../endpoints/userEndpoint";
import { Category } from "../models/category";
import { User } from "../models/user";
import { Thread } from "../models/thread";
import { IThreadEndpoint, ThreadEndpoint } from "../endpoints/threadEndpoint";
import { BasicUser } from "../models/basicUser";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export const SampleData = () => {
  const categoryEndpoint: ICategoryEndpoint = new CategoryEndpoint();
  const userEndpoint: IUserEndpoint = new UserEndpoint();
  const threadEndpoint: IThreadEndpoint = new ThreadEndpoint();

  const [isCatCreated, setIsCatCreated] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [isThreadsCreated, setIsThreadCreated] = useState(false);

  const navigate = useNavigate();

  const createCategories = async () => {
    // examples of categories
    var cat = new Category("Gaming", "Enjoy games with your friends!");
    await categoryEndpoint.createCategoryAsync(cat);

    cat = new Category("Sports", "Talk about your favorite sports!");
    await categoryEndpoint.createCategoryAsync(cat);

    cat = new Category("Business", "Communicate your best business practices!");
    await categoryEndpoint.createCategoryAsync(cat);

    cat = new Category("Crypto", "Crypto currency is next big thing!");
    await categoryEndpoint.createCategoryAsync(cat);

    setIsCatCreated(true);
  };

  const createUser = async () => {
    // examples of users

    var u = new User(
      "abc-123",
      "John",
      "Marston",
      "Elmo",
      "Elmo@gmail.com",
      ""
    );

    await userEndpoint.createUserAsync(u);

    setIsUserCreated(true);
  };

  const createThreads = async () => {
    const user = await userEndpoint.getUserAsync("BrBsdkHhOhckucGnbK11");
    const categories = await categoryEndpoint.getCategoriesAsync();

    const basicUser = BasicUser.fromUser(user);

    if (user === undefined || basicUser === undefined) {
      return;
    }

    var t = new Thread(
      "Bitcoin just sucks!",
      "Bitcoin is not a very wise thing to invest in.",
      categories[3],
      "",
      basicUser
    );

    console.log(t.author._id);

    await threadEndpoint.createThreadAsync(t);

    t = new Thread(
      "New star wars game sucks",
      "Badly optimized, very repetitive and boring",
      categories[0],
      "",
      basicUser
    );

    await threadEndpoint.createThreadAsync(t);

    setIsThreadCreated(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
        return;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div>
        {isUserCreated === false && (
          <button onClick={createUser}>Create User</button>
        )}
      </div>
      <div>
        {isCatCreated === false && (
          <button onClick={createCategories}>Create Categories</button>
        )}
      </div>
      <div>
        {isThreadsCreated === false && (
          <button onClick={createThreads}>Create Threads</button>
        )}
      </div>
    </div>
  );
};
