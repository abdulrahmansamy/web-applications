
```Dockerfile
# Use the UBI 9 Node.js 22 image
FROM registry.access.redhat.com/ubi9/nodejs-22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Set proper permissions
RUN chown -R node:node /app
USER node
RUN npm install

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "app.js"]
```



```bash
echo "your-email@gmail.com" > gmail_user.txt
echo "your-email-password" > gmail_password.txt



podman secret create GMAIL_USER gmail_user.txt
podman secret create GMAIL_PASS gmail_password.txt

podman build -f Containerfile -t nodejs-mail-function:latest

podman run --name mail-function -p 8080:8080 --rm \
  --secret GMAIL_USER,type=env,target=GMAIL_USER \
  --secret GMAIL_PASS,type=env,target=GMAIL_PASS \
  nodejs-mail-function:latest
  ```