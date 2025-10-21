import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { AuthMiddleware } from '@/core/auth/infra/http/middlewares/auth-middlewares';

const studentRoutes = Router();
const controller = new StudentController();
const auth = new AuthMiddleware();

studentRoutes.use(auth.authenticate);

studentRoutes.post('/', (req, res) => controller.create(req, res));
studentRoutes.put('/:id', (req, res) => controller.update(req, res));
studentRoutes.get('/search', (req, res) => controller.searchStudents(req, res));
studentRoutes.get('/employee/:employeeId', (req, res) => controller.listStudents(req, res));
studentRoutes.delete('/:id', (req, res) => controller.delete(req, res));



export { studentRoutes };
