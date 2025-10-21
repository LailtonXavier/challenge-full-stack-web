import { Student } from '@/core/student/domain/entities/student.entity';
import { Either, left, right } from '@/shared/core/utils/validation';

export class Employee {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: string,
    public active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly students: Student[] = [],
  ) {}

  public static create(props: {
    id?: string,
    name: string,
    email: string,
    password: string,
    role: string,
    active: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    students?: Student[],
  }): Either<Error, Employee> {
    if (!props.email.includes('@')) {
      return left(new Error('Invalid email'));
    }

    const now = new Date();

    return right(
      new Employee(
        props.id || '',
        props.name,
        props.email,
        props.password,
        props.role,
        props.active,
        props.createdAt || now,
        props.updatedAt || now,
        props.students ?? [],
      ),
    );
  }
}
