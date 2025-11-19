FROM node:20-alpine

WORKDIR /app

# Install main deps exactly as defined by your lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app last
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
