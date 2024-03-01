# Use an official Node.js runtime as the base image

FROM node:19.6.0-alpine AS builder
# Set the working directory within the container
WORKDIR /my-app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
RUN echo "Listing contents of /my-app directory:" && ls -la

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# RUN rm -rf ./*

# Copy built artifacts from the builder stage
COPY --from=builder /my-app/build .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]