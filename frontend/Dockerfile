# Dockerfile for frontend
FROM node:18 AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the TypeScript files
RUN npm run build

# Stage 2: Serve the build with Nginx
FROM nginx:stable-alpine

# Copy the build output from the previous stage to the Nginx container
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80