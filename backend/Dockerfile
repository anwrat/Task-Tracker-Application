# Use lightweight Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files for caching
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy app code
COPY . .

# Expose port
EXPOSE 3001

# Start the app
CMD ["node", "index.js"]