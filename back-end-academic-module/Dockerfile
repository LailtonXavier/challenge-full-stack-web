FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash postgresql-client

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npx prisma generate

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
