FROM node:18-bullseye-slim

RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY requirements.txt ./
RUN python3 -m venv my-venv
RUN my-venv/bin/pip install -r requirements.txt

COPY . .
CMD npm run start:dev:docker
