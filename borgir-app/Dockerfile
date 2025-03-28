# Use the official Node.js image as the base image (or another appropriate image like nginx)
FROM node:20 as build

# Set the working directory for the frontend
WORKDIR /app

# Copy package.json and package-lock.json
COPY borgir-app/package*.json ./

# Install dependencies for the frontend
RUN npm install

# Copy the entire client app
COPY borgir-app/ .

# Build the production-ready frontend app
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine

# Copy the build directory to the nginx container's default folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the frontend app will be served on (default port for nginx)
EXPOSE 80

# Start nginx to serve the frontend
CMD ["nginx", "-g", "daemon off;"]
