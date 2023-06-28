import { Thread } from "./thread";

export class BasicThread {
  id: string;
  thread: string;

  constructor(id: string, thread: string) {
    this.id = id;
    this.thread = thread;
  }

  static fromThread(thread: Thread): BasicThread {
    return {
      id: thread.id,
      thread: thread.thread,
    };
  }
}
