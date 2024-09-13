# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port on which the app will run (optional, usually port 3000)
EXPOSE 3000

# Define the command to run your application
CMD ["node", "src/index.js"]
