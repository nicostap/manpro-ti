FROM node:18-bullseye-slim

RUN apt-get update && apt-get install -y python3 python3-pip python3-opencv procps

WORKDIR /app

COPY package*.json .
RUN npm install

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN chmod -R +x /app/uploads

CMD npm run start:dev:docker
