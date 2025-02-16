// For Containerization, you need to create a Dockerfile

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Configure Gmail SMTP with environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER, // Use the environment variable for your email address
        subject: `${name}: New Contact Form Submission`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
        res.status(200).json({ success: true });
    });
});

const server = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

// Graceful shutdown handling
const gracefulShutdown = () => {
    console.log('Received SIGTERM, closing HTTP server...');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });

    // Forcefully shut down after 10 seconds if server doesn't close
    setTimeout(() => {
        console.error('Forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
