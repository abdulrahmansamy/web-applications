// For google cloud functions, with reCAPTCHA verification.
// you need to use the functions-framework package
// Environment Variables: GMAIL_USER, GMAIL_PASS, TARGET_EMAIL, RECAPTCHA_SECRET_KEY
// using cors package to enable Cross-Origin Resource Sharing.
// using nodemailer package to send emails.
// using express package to create a server.
// using body-parser package to parse the request body.
// using axios package to make HTTP requests.
 
const functions = require('@google-cloud/functions-framework'); // Import the functions-framework package

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const axios = require('axios'); // Import the axios package, for making HTTP requests, for reCAPTCHA 

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

app.post('/send-email', async (req, res) => {
    const { name, subject, email, message, 'g-recaptcha-response': recaptchaToken } = req.body;
    console.log('Received request:', req.body); // Logging the request body

    // Verify reCAPTCHA token
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
        const response = await axios.post(verificationUrl);
        const { success } = response.data;

        if (!success) {
            return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
        }

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
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error); // Logging the error
        res.status(500).json({ success: false, error: error.message });
    }
});

functions.http('sendEmailFunction', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    app(req, res);
});