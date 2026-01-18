const buttons = document.querySelectorAll('.button--download');

buttons.forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault();

        // cloudflare worker
        const workerUrl = 'https://lowkkid.dev/cv';
        const filename = 'Vladislav_Shikunov_Java.pdf';

        try {
            button.style.opacity = '0.7';
            button.style.pointerEvents = 'none';

            const response = await fetch(workerUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);

            button.style.opacity = '';
            button.style.pointerEvents = '';
        } catch (error) {
            console.error('Download error:', error);
            button.style.opacity = '';
            button.style.pointerEvents = '';
            alert('Failed to download file. Please try again.');
        }
    });
});