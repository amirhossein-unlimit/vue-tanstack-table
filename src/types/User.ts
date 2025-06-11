export interface User {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  role: 'admin' | 'user' | 'superAdmin';
}
