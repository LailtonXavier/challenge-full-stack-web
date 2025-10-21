export interface Student {
  id: string;
  name: string;
  email: string;
  ra: string;
  cpf: string;
  active: boolean;
  employeeId: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedStudents {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}