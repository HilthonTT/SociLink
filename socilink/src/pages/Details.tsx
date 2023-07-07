import { useParams } from "react-router-dom";
import { IThreadData, ThreadData } from "../data/threadData";
import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { Comment } from "../models/comment";
import { BasicThread } from "../models/basicThread";
import { BasicUser } from "../models/basicUser";
import { AuthHelper, IAuthHelper } from "../authentication/authHelper";
import { User } from "../models/user";
import { CommentData, ICommentData } from "../data/commentData";

export const Details = () => {
  const { id } = useParams();
  const threadData: IThreadData = new ThreadData();
  const authHelper: IAuthHelper = new AuthHelper();
  const commentData: ICommentData = new CommentData();

  const user = authHelper.getAuthState();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState("");

  const getThreadAsync = async () => {
    const fetchedThread = await threadData.getThreadAsync(id as string);

    if (fetchedThread === null || fetchedThread === undefined) {
      return;
    }

    setThread(fetchedThread);
  };

  const onCommentAsync = async () => {
    if (comment === "" || thread === undefined || thread === null) {
      return;
    }

    const basicThread = BasicThread.fromThread(thread as Thread);
    const basicUser = BasicUser.fromUser((await user) as User);

    const newComment = new Comment(comment, basicThread, basicUser);

    await commentData.createCommentAsync(newComment);
  };

  useEffect(() => {
    getThreadAsync();
  }, [thread]);

  return (
    <div>
      <div>{thread?.thread}</div>
      <div>{id}</div>
    </div>
  );
};
