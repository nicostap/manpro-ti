# Use node alpine as it's a small node image
FROM node:alpine

# Create the directory on the node image where our Vite app will live
RUN mkdir -p /app

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the /app working directory
COPY package*.json .

# Install dependencies in /app
RUN npm install

# Copy the rest of our Vite folder into /app
COPY . .

# Ensure port 8000 is accessible to our system
EXPOSE 8000

# Run npm run dev, as we would via the command line
CMD ["npm", "run", "dev"]
