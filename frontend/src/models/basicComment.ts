import { Comment } from "./comment";

export class BasicComment {
  _id: string;
  comment: string;

  constructor(id: string, comment: string) {
    this._id = id;
    this.comment = comment;
  }

  static fromComment(comment: Comment): BasicComment {
    return {
      _id: comment._id,
      comment: comment.comment,
    };
  }
}
