document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Sending data:', data);

    fetch('https://us-central1.googlecloudproject.cloudfunctions.net/node-mail-function/send-email', {
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
});