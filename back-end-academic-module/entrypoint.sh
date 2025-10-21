set -e

echo "Aguardando Postgres..."

until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT; do
  sleep 1
done

echo "Postgres pronto! Gerando Prisma e aplicando migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Iniciando aplicação..."
exec npm run dev
