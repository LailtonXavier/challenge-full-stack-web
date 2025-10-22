import * as express from 'express';
import cors from 'cors';
import { errorHandlerMiddleware } from '@/shared/infra/http/middlewares/error-handler.middleware';
import { router as home } from '../routes/home.routes';
import { authRoutes } from '@/core/auth/infra/http/routes/auth.routes';
import { employeeRoutes } from '@/core/employee/infra/http/routes/employee.routes';
import { studentRoutes } from '@/core/student/infra/http/routes/student.routes';

const app = express.default();

const allowedOrigins = [
  'https://front-end-academic-module.vercel.app',
  'http://localhost:3000',
  'http://localhost:8080'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', home);
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(errorHandlerMiddleware);

export { app };
export default app;
