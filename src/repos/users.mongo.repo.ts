import createDebug from 'debug';
import { Repository } from './repo';
import { LoginUser, User } from '../entities/user.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';

const debug = createDebug('Users:users:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.passwd = await Auth.hash(newItem.passwd);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email }).exec();
    if (!result || !(await Auth.compare(loginUser.passwd, result.passwd)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: keyof User;
    value: any;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate('author', {
        users: 0,
      })
      .exec();

    return result;
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async addFriend(id: string, updatedItem: Partial<User>): Promise<User> {
    const user = await UserModel.findById(updatedItem.id).exec();
    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    if (user.friends.includes(id as unknown as User)) {
      return user;
    }

    if (user.opps.includes(id as unknown as User)) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        updatedItem.id,
        { $pull: { opps: id } },
        {
          new: true,
        }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }
    }

    const result = await UserModel.findByIdAndUpdate(
      updatedItem.id,
      { $push: { friends: id } },
      {
        new: true,
      }
    ).exec();

    if (!result) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return result;
  }

  async addEnemy(id: string, updatedItem: Partial<User>): Promise<User> {
    const user = await UserModel.findById(updatedItem.id).exec();
    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    if (user.opps.includes(id as unknown as User)) {
      return user;
    }

    if (user.friends.includes(id as unknown as User)) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        updatedItem.id,
        { $pull: { friends: id } },
        {
          new: true,
        }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }
    }

    const result = await UserModel.findByIdAndUpdate(
      updatedItem.id,
      { $push: { opps: id } },
      {
        new: true,
      }
    ).exec();

    if (!result) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }
}
