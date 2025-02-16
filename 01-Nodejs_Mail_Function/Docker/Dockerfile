# Use the UBI 9 Node.js 22 image
FROM registry.access.redhat.com/ubi9/nodejs-22

# Set the working directory
WORKDIR /app

# Create a new user and group
USER root

# Set proper permissions
RUN groupadd -r node && useradd -m -r -g node node \
    && mkdir -p /opt/app-root/src/.npm \
    && chown -R node:node /app && chown -R node:node /opt/app-root/src/.npm

USER node

# Copy package.json and package-lock.json
COPY package*.json app.js ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# COPY app.js .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "app.js"]