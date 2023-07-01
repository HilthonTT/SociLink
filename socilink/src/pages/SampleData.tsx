import { useState } from "react";
import { CategoryData, ICategoryData } from "../data/categoryData";
import { IUserData, UserData } from "../data/userData";
import { Category } from "../models/category";
import { User } from "../models/user";
import { Thread } from "../models/thread";
import { IThreadData, ThreadData } from "../data/threadData";
import { BasicUser } from "../models/basicUser";

export const SampleData = () => {
  const categoryData: ICategoryData = new CategoryData();
  const userData: IUserData = new UserData();
  const threadData: IThreadData = new ThreadData();

  const [isCatCreated, setIsCatCreated] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [isThreadsCreated, setIsThreadCreated] = useState(false);

  const createCategories = async () => {
    // examples of categories
    var cat = new Category("Gaming", "Enjoy games with your friends!");
    await categoryData.createCategoryAsync(cat);

    cat = new Category("Sports", "Talk about your favorite sports!");
    await categoryData.createCategoryAsync(cat);

    cat = new Category("Business", "Communicate your best business practices!");
    await categoryData.createCategoryAsync(cat);

    cat = new Category("Crypto", "Crypto currency is next big thing!");
    await categoryData.createCategoryAsync(cat);

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

    await userData.createUserAsync(u);

    setIsUserCreated(true);
  };

  const createThreads = async () => {
    const user = await userData.getUserAsync("BrBsdkHhOhckucGnbK11");
    const categories = await categoryData.getCategoriesAsync();

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

    console.log(t.author.id);

    await threadData.createThreadAsync(t);

    t = new Thread(
      "New star wars game sucks",
      "Badly optimized, very repetitive and boring",
      categories[0],
      "",
      basicUser
    );

    await threadData.createThreadAsync(t);

    setIsThreadCreated(true);
  };

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
