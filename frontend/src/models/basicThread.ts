import { Thread } from "./thread";

export class BasicThread {
  _id: string;
  thread: string;

  constructor(id: string, thread: string) {
    this._id = id;
    this.thread = thread;
  }

  static fromThread(thread: Thread): BasicThread {
    return {
      _id: thread._id,
      thread: thread.thread,
    };
  }
}