import { useParams } from "react-router-dom";
import { IThreadData, ThreadData } from "../data/threadData";
import { useEffect, useState } from "react";
import { Thread } from "../models/thread";
import { Comment } from "../models/comment";
import { BasicThread } from "../models/basicThread";
import { BasicUser } from "../models/basicUser";
import { User } from "../models/user";
import { CommentData, ICommentData } from "../data/commentData";
import { useAuthHelper } from "../authentication/authHelper";

export const Details = () => {
  const { id } = useParams();
  const { getUserFromAuth } = useAuthHelper();

  const threadData: IThreadData = new ThreadData();
  const commentData: ICommentData = new CommentData();

  const [user, setUser] = useState<User | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [comment, setComment] = useState("");

  const getThreadAsync = async () => {
    const fetchedThread = await threadData.getThreadAsync(id as string);

    if (fetchedThread === null) {
      return;
    }

    setThread(fetchedThread);
  };

  const getThreadCommentsAsync = async () => {
    const fetchedComments = await commentData.getThreadCommentsAsync(
      id as string
    );

    setComments(fetchedComments);
  };

  const onCommentAsync = async () => {
    if (comment === "" || thread === undefined || thread === null) {
      return;
    }

    const basicThread = BasicThread.fromThread(thread as Thread);
    const basicUser = BasicUser.fromUser(user as User);

    const newComment = new Comment(comment, basicThread, basicUser);
    comments?.push(newComment);

    await commentData.createCommentAsync(newComment);
    setComment("");
  };

  const getUser = async () => {
    const user = await getUserFromAuth();
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getThreadAsync();
  }, []);

  useEffect(() => {
    getThreadCommentsAsync();
  }, []);

  return (
    <div>
      {thread ? (
        <div>
          {comments?.length}
          <div>{thread?.thread}</div>
          <div>{thread?.description}</div>
          <br />
          <br />
          <div>
            <label htmlFor="comment">Comment here</label>
            <textarea
              id="comment"
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div>
              <button type="button" onClick={onCommentAsync}>
                Comment
              </button>
            </div>
          </div>
          <div>
            <label>Comments</label>
            <ul>
              {comments?.map((c) => (
                <li key={c.id}>
                  {c.comment} <strong>By {c.author.displayName}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>No Thread Found.</div>
      )}
    </div>
  );
};
