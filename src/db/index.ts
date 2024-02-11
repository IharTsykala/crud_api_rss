import { EventEmitter } from 'events';
import { IUser } from '../interfaces';

export class Database {
  static instance: Database;
  emitter: EventEmitter;
  data: { [key: string]: [] | IUser[] };

  private constructor() {
    this.data = {
      users: [],
    };
    this.emitter = new EventEmitter();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  update(data: any) {
    this.data = data;
    this.emitter.emit('update', data);
  }
}
