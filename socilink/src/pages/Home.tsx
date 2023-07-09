import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { Category } from "../models/category";
import { IThreadData, ThreadData } from "../data/threadData";
import { CategoryData, ICategoryData } from "../data/categoryData";
import { useAuthHelper } from "../authentication/authHelper";
import { useNavigate } from "react-router-dom";
import { User } from "../models/user";

export const Home = () => {
  const { getUserFromAuth } = useAuthHelper();

  const threadData: IThreadData = new ThreadData();
  const categoryData: ICategoryData = new CategoryData();

  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const openDetails = (thread: Thread) => {
    navigate(`Details/${thread.id}`);
  };

  const getThreadsAsync = async () => {
    const threads = await threadData.getThreadsAsync();
    setThreads(threads);
  };

  const getCategoriesAsync = async () => {
    const categories = await categoryData.getCategoriesAsync();
    setCategories(categories);
  };

  const onCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const getUser = async () => {
    const user = await getUserFromAuth();
    setLoggedInUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getThreadsAsync();
  }, []);

  useEffect(() => {
    getCategoriesAsync();
  }, []);

  return (
    <div>
      <div>
        {threads &&
          threads.map((t) => (
            <div key={t.id} onClick={() => openDetails(t)}>
              {t.thread}
            </div>
          ))}
      </div>
      <div>
        {categories &&
          categories.map((c) => (
            <div key={c.id} onClick={() => onCategoryClick(c)}>
              {c.name}
            </div>
          ))}
      </div>
    </div>
  );
};
