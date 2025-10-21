import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.test' });

if (process.env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV deve ser "test" para executar testes');
}

beforeAll(async () => {
  try {
    execSync('npx prisma migrate deploy --skip-generate', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
});

afterAll(async () => {
  const { prisma } = await import('@/infra/database/prisma/prismaClient');
  await prisma.$disconnect();
});