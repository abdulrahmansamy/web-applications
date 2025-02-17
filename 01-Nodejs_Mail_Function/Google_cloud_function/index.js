// For google cloud functions.
// No reCAPTCHA verification.
// you need to use the functions-framework package
// Environment Variables: GMAIL_USER, GMAIL_PASS, TARGET_EMAIL.
// using cors package to enable Cross-Origin Resource Sharing.
// using nodemailer package to send emails.
// using express package to create a server.
// using body-parser package to parse the request body.

const functions = require('@google-cloud/functions-framework');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const { name, subject, email, message } = req.body;
    console.log('Received request:', req.body); // Logging the request body

    const mailOptions = {
        from: email,
        to: process.env.TARGET_EMAIL, // Use the environment variable for your email address
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

functions.http('sendEmailFunction', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    app(req, res);
});