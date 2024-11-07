FROM node:alpine

RUN mkdir -p /app

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
