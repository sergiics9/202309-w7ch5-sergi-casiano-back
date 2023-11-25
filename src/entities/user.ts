export type Relation = 'friend' | 'opp' | 'stranger';

export type LoginUser = {
  email: string;
  passwd: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  age: number;
  relation: Relation;
  friends: User[];
  opps: User[];
  author: User;
};
