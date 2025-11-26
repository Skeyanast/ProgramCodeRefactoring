FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./app ./app
COPY migrations ./migrations
COPY .env.example ./.env

RUN mkdir -p logs

EXPOSE 8000

CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm start"]