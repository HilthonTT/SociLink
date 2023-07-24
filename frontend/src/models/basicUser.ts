import { User } from "./user";

export class BasicUser {
  _id: string;
  displayName: string;

  constructor(id: string, displayName: string) {
    this._id = id;
    this.displayName = displayName;
  }

  static fromUser(user: User): BasicUser {
    return {
      _id: user._id,
      displayName: user.displayName,
    };
  }
}
