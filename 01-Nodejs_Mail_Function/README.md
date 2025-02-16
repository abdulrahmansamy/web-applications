# Form Email Function
Send email from your HTML forms.

## Description
This solution consists of a frontend HTML form and a backend server to handle form submissions. The form allows users to input their name, subject, email, and message. Upon submission, the form data is captured by a JavaScript function and sent to the backend server. The server processes the data and sends an email using Gmail's SMTP service.

## Frontend

### HTML Form
The [HTML form](form.html) (`<form id="contact-form">`) includes the following fields:
- **Name**: An input field for the user's name.
- **Subject**: An input field for the subject of the message.
- **Email**: An input field for the user's email address.
- **Message**: A textarea for the user's message.
- **Submit Button**: A button to submit the form.

### JavaScript Function
The JavaScript function is attached to the form's `submit` event using `addEventListener`. When the form is submitted, the function performs the following steps:

1. **Prevent Default Form Submission**:
    ```js
    event.preventDefault();
    ```
    This prevents the default form submission behavior, allowing the function to handle the submission via JavaScript.

2. **Capture Form Data**:
    ```js
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    ```
    The `FormData` object captures the form data, and the data is converted into a plain object (`data`) for easier manipulation.

3. **Log the Data**:
    ```js
    console.log('Sending data:', data);
    ```
    The captured data is logged to the console for debugging purposes.

4. **Send Data via Fetch API**:
    ```js
    fetch('http://localhost:8080/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(result => {
        console.log('Result:', result);
        if (result.success) {
            alert('Email sent successfully!');
        } else {
            alert('Failed to send email.');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Failed to send email. Error: ' + error.message);
    });
    ```
    The `fetch` function sends a POST request to the specified URL with the form data in JSON format. The response is handled as follows:
    - **Log the Response**: The response is logged to the console.
    - **Check for Errors**: If the response is not OK, an error is thrown.
    - **Parse the Response**: The response is parsed as JSON.
    - **Handle the Result**: If the email is sent successfully, an alert is shown. Otherwise, an error alert is shown.
    - **Catch Errors**: Any errors during the fetch operation are caught and logged, and an error alert is shown.

This code effectively captures form data, sends it to a server endpoint, and handles the response, providing feedback to the user about the success or failure of the email submission.

## Backend

### Server Side Code
The server-side [code](Google_cloud_function/index.js) sets up an Express server to handle HTTP POST requests for sending emails using the Gmail service. It uses the `nodemailer` package to send emails and the `cors` middleware to enable Cross-Origin Resource Sharing (CORS). The server is designed to run as a Google Cloud Function.

### Key Components:

1. **Imports and Setup**:
    ```js
    const functions = require('@google-cloud/functions-framework');
    const express = require('express');
    const bodyParser = require('body-parser');
    const nodemailer = require('nodemailer');
    const cors = require('cors');

    const app = express();
    app.use(bodyParser.json());
    app.use(cors()); // Enable CORS
    ```

    - **functions**: Imports the Google Cloud Functions framework.
    - **express**: Imports the Express framework to create the server.
    - **bodyParser**: Middleware to parse JSON request bodies.
    - **nodemailer**: Library to send emails.
    - **cors**: Middleware to enable CORS.

2. **Nodemailer Transporter**:
    ```js
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    ```

    - **transporter**: Configures Nodemailer to use the Gmail service with authentication credentials stored in environment variables (`GMAIL_USER` and `GMAIL_PASS`).

3. **POST Route for Sending Emails**:
    ```js
    app.post('/send-email', (req, res) => {
        const { name, subject, email, message } = req.body;
        console.log('Received request:', req.body); // Logging the request body

        const mailOptions = {
            from: email,
            to: process.env.GMAIL_USER,
            subject: `${name}: New Contact Form Submission`,
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error); // Logging the error
                return res.status(500).json({ success: false, error: error.message });
            }
            console.log('Email sent:', info.response); // Logging the response
            res.status(200).json({ success: true });
        });
    });
    ```

    - **Route**: Defines a POST route `/send-email` to handle email sending.
    - **Request Handling**: Extracts `name`, `subject`, `email`, and `message` from the request body.
    - **Logging**: Logs the received request body.
    - **Mail Options**: Configures the email details, including the sender, recipient, subject, and message body.
    - **Send Email**: Uses the `transporter` to send the email and handles success or error responses.

4. **Google Cloud Function**:
    ```js
    functions.http('sendEmailFunction', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        app(req, res);
    });
    ```

    - **Function**: Defines a Google Cloud Function named `sendEmailFunction` that uses the Express app to handle HTTP requests.
    - **Content-Type Header**: Sets the response content type to `application/json`.

### Summary
This solution consists of a frontend HTML form and a backend server to handle form submissions. The frontend captures the user's data and sends it to the backend server. The backend processes the data, sends an email using Gmail's SMTP service, and provides feedback to the frontend about the success or failure of the email submission. The server-side code is designed to run as a Google Cloud Function with CORS enabled to allow cross-origin requests and uses environment variables for secure handling of Gmail credentials.
