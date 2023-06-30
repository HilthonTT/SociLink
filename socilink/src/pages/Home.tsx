import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { Category } from "../models/category";
import { IThreadData, ThreadData } from "../data/threadData";
import { CategoryData, ICategoryData } from "../data/categoryData";
import { AuthHelper, IAuthHelper } from "../authentication/authHelper";

export const Home = () => {
  const threadData: IThreadData = new ThreadData();
  const categoryData: ICategoryData = new CategoryData();
  const authHelper: IAuthHelper = new AuthHelper();

  const user = authHelper.getAuthState();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const getThreadsAsync = async () => {
    const threads = await threadData.getThreadsAsync();
    setThreads(threads);
  };

  const getCategoriesAsync = async () => {
    const categories = await categoryData.getCategoriesAsync();
    setCategories(categories);
  };

  useEffect(() => {
    getThreadsAsync();
  }, [threads]);

  useEffect(() => {
    getCategoriesAsync();
  }, [categories]);

  return (
    <div>
      <div>{threads && threads.map((t) => <div>{t.thread}</div>)}</div>
      <div>{categories && categories.map((c) => <div>{c.name}</div>)}</div>
    </div>
  );
};
