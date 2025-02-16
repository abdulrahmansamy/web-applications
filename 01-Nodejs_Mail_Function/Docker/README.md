# Server Setup
This guide provides step-by-step instructions for building and running a containerized Node.js application to handle email submissions using Gmail as the mail service provider.

## 1. Building the Container Image

### 1.1. Create the Dockerfile
Create a Dockerfile with the following content:

```Dockerfile
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
```

### 1.2. Build the Image
Build the Docker image using the following command:

```bash
podman build -f Containerfile -t nodejs-mail-function:latest
```
## 2. Running the Container
### 2.1. Set Environment Variables
Store your Gmail credentials in text files and create secrets:

```bash
echo "your-email@gmail.com" > gmail_user.txt
echo "your-email-password" > gmail_password.txt
```

```bash
podman secret create GMAIL_USER gmail_user.txt
podman secret create GMAIL_PASS gmail_password.txt
```

### 2.2. Run the Container
Run the container with the necessary secrets:

```bash
podman run --name mail-function -p 8080:8080 --rm \
  --secret GMAIL_USER,type=env,target=GMAIL_USER \
  --secret GMAIL_PASS,type=env,target=GMAIL_PASS \
  nodejs-mail-function:latest
```

## 3. Testing
### 3.1. Check the Server Side
Use curl to test the email submission endpoint:

```bash
curl -X POST http://localhost:8080/send-email \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "subject":"welcome!", "email": "john.doe@example.com", "message": "Hello!"}'
```

This will send a test email using the provided form data.

This guide ensures that your Node.jsapplication is properly containerized, securely handling Gmail credentials, and ready to process email submissions.