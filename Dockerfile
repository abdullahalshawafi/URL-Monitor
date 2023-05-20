FROM node:18-alpine

# Create app directory
WORKDIR /app/

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build app
RUN yarn build

# Expose port
EXPOSE 3000

# Start app
CMD ["yarn", "start:prod"]
