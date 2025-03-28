# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies for the server
RUN npm install

# Copy the entire server app into the container
COPY server/ .

# Expose the port where the backend server runs
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]
