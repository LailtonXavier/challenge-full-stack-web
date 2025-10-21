import { AuthMiddleware } from '@/core/auth/infra/http/middlewares/auth-middlewares';
import { EmployeeController } from '@/core/employee/infra/http/controllers/employee.controller';
import { Router } from 'express';

const employeeRoutes = Router();

const employeeController = new EmployeeController();
const auth = new AuthMiddleware();

employeeRoutes.post('/',(req, res) => employeeController.create(req, res));
employeeRoutes.get(
  '/:id',
  auth.authenticate,
  (req, res) => employeeController.getById(req, res)
);

export { employeeRoutes };
