import { Either, left, right } from '@/shared/core/utils/validation';

export class Student {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public ra: string,
    public cpf: string,
    public active: boolean,
    public employeeId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static create(props: {
    id?: string,
    name: string,
    email: string,
    ra: string,
    cpf: string,
    active: boolean,
    employeeId: string,
    createdAt?: Date,
    updatedAt?: Date,
  }): Either<Error, Student> {
    if (!props.email.includes('@')) {
      return left(new Error('Invalid email'));
    }

    const now = new Date();

    return right(
      new Student(
        props.id || '',
        props.name,
        props.email,
        props.ra,
        props.cpf,
        props.active,
        props.employeeId,
        props.createdAt || now,
        props.updatedAt || now,
      ),
    );
  }
}
