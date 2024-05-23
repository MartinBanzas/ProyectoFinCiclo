# Use Node.js as the base image
FROM node:20.12.0-bookworm-slim

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json
COPY package.json ./
COPY package-lock.json ./
# Install dependencies
RUN npm install
RUN npm install react-scripts@3.4.1 -g --silent

# Copy the rest of the application
COPY . ./

# Build the React application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000 80

# Command to run the application
CMD ["npm", "start"]