import { Comment } from "./comment";

export class BasicComment {
  id: string;
  comment: string;

  constructor(id: string, comment: string) {
    this.id = id;
    this.comment = comment;
  }

  static fromComment(comment: Comment): BasicComment {
    return {
      id: comment.id,
      comment: comment.comment,
    };
  }
}
