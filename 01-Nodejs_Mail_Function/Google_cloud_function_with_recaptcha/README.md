# Google Cloud Function with reCAPTCHA Verification

This project demonstrates how to create a Google Cloud Function that handles form submissions with reCAPTCHA verification. The form data is captured and sent via a POST request to the specified server endpoint, which then sends an email using the provided details. The reCAPTCHA verification ensures that the form submission is from a human and not a bot.

## Prerequisites

- Node.js installed
- Google Cloud SDK installed and configured
- A Google Cloud project with billing enabled
- reCAPTCHA site and secret keys
- Gmail account for sending emails

## Setup

1. Clone the repository:
    ```sh
    git clone /Users/abdulrahmansamy/git-repos/web-applications/01-Nodejs_Mail_Function/Google_cloud_function_with_recaptcha
    cd Google_cloud_function_with_recaptcha
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    GMAIL_USER=your-email@gmail.com
    GMAIL_PASS=your-email-password
    TARGET_EMAIL=target-email@gmail.com
    RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
    ```

4. Deploy the function to Google Cloud:
    ```sh
    gcloud functions deploy sendEmailFunction --runtime nodejs14 --trigger-http --allow-unauthenticated
    ```

## Usage

1. Update the `YOUR_SITE_KEY` in `form.html` and `scripts.js` with your reCAPTCHA site key.

2. Open `form.html` in a web browser.

3. Fill out the form and submit it.

4. The form data will be sent to the Google Cloud Function endpoint, which will verify the reCAPTCHA token and send an email if the verification is successful.

## Files

- `index.js`: The main file for the Google Cloud Function.
- `package.json`: The project configuration file.
- `form.html`: The HTML form for capturing user input.
- `scripts.js`: The JavaScript file for handling form submission and reCAPTCHA verification.

## License

This project is licensed under the ISC License.
