import app from './infra/http/express/app';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import swaggerSpec from './infra/config/swagger/swagger';

dotenv.config();

const PORT = process.env.PORT || 3000;
const URL_API = process.env.URL_API || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on ${URL_API}:${PORT}`);
  console.log(`Documentação Swagger disponível em: ${URL_API}:${PORT}/api-docs`);
});
