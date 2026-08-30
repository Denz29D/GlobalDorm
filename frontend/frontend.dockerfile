# Dockerfile for React app
FROM node:18

# Copy the frontend code into the image
WORKDIR /app
COPY . .

# Install dependencies and build the frontend
RUN npm install && npm run build

# Serve the app on port 3000
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
