import type { Student } from './student';

export interface Employee {
  id: string,
  name: string,
  email: string,
  password: string,
  role: string,
  active: boolean,
  createdAt: Date,
  updatedAt: Date,
  students: Student[] | [],
}