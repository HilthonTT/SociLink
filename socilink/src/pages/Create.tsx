import { useNavigate } from "react-router-dom";
import { IThreadData, ThreadData } from "../data/threadData";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateData } from "../form-models/createData";
import { Category } from "../models/category";
import { AuthHelper } from "../authentication/authHelper";
import { CategoryData, ICategoryData } from "../data/categoryData";
import { Thread } from "../models/thread";
import { BasicUser } from "../models/basicUser";
import { User } from "../models/user";
import { IImageData, ImageData } from "../data/imageData";

export const Create = () => {
  const threadData: IThreadData = new ThreadData();
  const categoryData: ICategoryData = new CategoryData();
  const imageData: IImageData = new ImageData();

  const authHelper = new AuthHelper();
  const navigate = useNavigate();

  const user = authHelper.getAuthState();
  const [categories, setCategories] = useState<Category[] | null>();
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const schema = yup.object().shape({
    thread: yup
      .string()
      .required("You cannot create a thread without a thread!")
      .min(5, "Your thread must be at least 5 characters long")
      .max(75, "Your thread must not be above 75 characters long."),
    description: yup
      .string()
      .required("You cannot creata a thread without a description.")
      .min(5, "Your description must be at least 5 characters long.")
      .max(500, "Your description must not be above 500 characters long."),
    categoryId: yup.string().min(1).required("You must select a category."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateData>({
    resolver: yupResolver(schema),
  });

  const getCategoriesAsync = async () => {
    const categories = await categoryData.getCategoriesAsync();
    setCategories(categories);
  };

  const closePage = () => {
    navigate("/");
  };

  const onCreateThreadAsync = async (data: CreateData) => {
    try {
      setErrorMessage("");
      if (user === undefined || user === null) {
        setErrorMessage("You are not logged in.");
        return;
      }

      const author = BasicUser.fromUser((await user) as User) as BasicUser;
      const thread = new Thread(
        data.thread,
        data.description,
        new Category("", ""),
        "",
        author
      );

      thread.category = categories?.find(
        (c) => c.id === data.categoryId
      ) as Category;

      if (thread.category === null || thread.category === undefined) {
        data.categoryId = "";
        return;
      }

      if (file) {
        const downloadUrl = await imageData.uploadAsync(file, file.name);
        thread.downloadUrl = downloadUrl;
      }

      await threadData.createThreadAsync(thread);
      closePage();
    } catch {
      setErrorMessage("Something went wrong while uploading your thread.");
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fetchedFile = event.target.files?.[0];

    if (fetchedFile) {
      setFile(fetchedFile);
    }
  };

  useEffect(() => {
    getCategoriesAsync();
  }, [categories]);

  return (
    <div>
      <div>
        <div>{errorMessage && <div>{errorMessage}</div>}</div>
      </div>
      <div>
        <form onSubmit={handleSubmit(onCreateThreadAsync)}>
          <div>
            <label htmlFor="photo">Photo</label>
            <div>
              Select a photo related to your thread. This isn't required.
            </div>
            <input type="file" onChange={onFileChange} />
          </div>
          <div>
            <label htmlFor="thread">Thread</label>
            <div>Please sum up your entire thread.</div>
            <input type="text" id="thread" {...register("thread")} />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <div>Describe your thread, explain what it's about.</div>
            <textarea
              typeof="text"
              id="description"
              {...register("description")}
            />
          </div>
          <div>
            <label>Select a category.</label>
            {categories?.map((cat) => (
              <div>
                <label>{cat.name}</label>
                <input type="radio" value={cat.id} {...register("categoryId")} />
              </div>
            ))}
          </div>
          <div>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};
