export interface ICreateUserPayload {
  name: string;
  email: string;
  age: number;
}

export interface IUpdateUserPayload {
  name?: string;
  email?: string;
  age?: number;
}