import { left, right } from '@/shared/core/utils/validation';
import { AlreadyExistsError, EmailAlreadyExistsError, NotFoundError } from '@/shared/errors/app-error';
import { randomUUID } from 'crypto';
import { StudentRepository } from '../../domain/repository/student.repository';
import { CreateStudentDTO } from '../dto/create-student.dto';
import { Student } from '../../domain/entities/student.entity';
import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';

export class CreateStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(data: CreateStudentDTO) {
    const { email, ra, cpf, employeeId } = data;

    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee) {
      return left(new NotFoundError('Employee', employeeId));
    }

    const studentByEmail = await this.studentRepository.findByEmail(email);
    if (studentByEmail) {
      return left(new EmailAlreadyExistsError(email));
    }

    const studentByRA = await this.studentRepository.findByRA(ra);
    if (studentByRA) {
      return left(new AlreadyExistsError(ra));
    }

    const studentByCPF = await this.studentRepository.findByCPF(cpf);
    if (studentByCPF) {
      return left(new AlreadyExistsError(cpf));
    }

    const student = new Student(
      randomUUID(),
      data.name,
      data.email,
      data.ra,
      data.cpf,
      true,
      data.employeeId,
      new Date(), 
      new Date()
    );

    const createdStudent = await this.studentRepository.create(student);
    return right(createdStudent);
   
  }
}