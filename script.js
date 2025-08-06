document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('airdrop-form');
    const messageBox = document.getElementById('message');
    const submissionCounter = document.getElementById('submission-counter');

    async function updateSubmissionCount() {
        try {
            const response = await fetch('/api/airdrop');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            submissionCounter.textContent = `Submissions: ${data.total}`;
        } catch (error) {
            console.error('Failed to get submission count:', error);
            submissionCounter.textContent = 'Submissions: ???';
        }
    }

    async function submitForm(event) {
        event.preventDefault();

        const address = document.getElementById('address').value;
        const twitter = document.getElementById('twitter').value;
        const telegram = document.getElementById('telegram').value;

        try {
            const response = await fetch('/api/airdrop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address, twitter, telegram })
            });

            const data = await response.json();

            if (response.ok) {
                messageBox.textContent = 'Thank you! Your submission has been recorded.';
                messageBox.classList.add('success');
                messageBox.classList.remove('error');
                updateSubmissionCount(); // Aktualizacja licznika
            } else if (response.status === 409) {
                messageBox.textContent = data.error || 'This wallet has already been submitted.';
                messageBox.classList.add('error');
                messageBox.classList.remove('success');
            } else {
                messageBox.textContent = `Error: ${data.error || 'Something went wrong.'}`;
                messageBox.classList.add('error');
                messageBox.classList.remove('success');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            messageBox.textContent = 'Submission failed. Please try again later.';
            messageBox.classList.add('error');
            messageBox.classList.remove('success');
        }
    }

    // Inicjalizacja
    updateSubmissionCount();
    form.addEventListener('submit', submitForm);
});