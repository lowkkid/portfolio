const WORKER_URL = 'https://lowkkid.dev/portfolio';

const buttons = document.querySelectorAll('.button--download');
const form = document.querySelector('form');
const skillsHeaders = document.querySelectorAll('.skills__header');
const burger = document.querySelector('.burger');
const headerNav = document.querySelector('.header__navigation');

function getToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    let iconHtml;
    if (type === 'success') {
        iconHtml = `
            <span class="toast__icon">
                <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
                    <circle class="circle" fill="#5bb543" cx="24" cy="24" r="22"/>
                    <path class="tick" fill="none" stroke="#FFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M14 27l5.917 4.917L34 17"/>
                </svg>
            </span>`;
    } else {
        iconHtml = `
            <span class="toast__icon toast__icon--error">
                <svg fill="#e74c3c" viewBox="0 -8 528 528" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M264 456Q210 456 164 429 118 402 91 356 64 310 64 256 64 202 91 156 118 110 164 83 210 56 264 56 318 56 364 83 410 110 437 156 464 202 464 256 464 310 437 356 410 402 364 429 318 456 264 456ZM264 288L328 352 360 320 296 256 360 192 328 160 264 224 200 160 168 192 232 256 168 320 200 352 264 288Z"></path>
                    </g>
                </svg>
            </span>
        `;
    }

    toast.innerHTML = `${iconHtml}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast--hiding');
        toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
}

function showSuccessMessage() {
    showToast('Message sent successfully!', 'success');
}

function showErrorMessage(errorText) {
    console.error('Form submission error:', errorText);
    showToast('Failed to send message', 'error');
}

buttons.forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault();

        const filename = 'Vladislav_Shikunov_Java.pdf';

        try {
            button.style.opacity = '0.7';
            button.style.pointerEvents = 'none';

            const response = await fetch(WORKER_URL);
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

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showSuccessMessage();
            form.reset();
        } else {
            const errorText = await response.text();
            showErrorMessage(errorText);
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

skillsHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const category = header.dataset.category;
        const list = document.querySelector(`[data-list="${category}"]`);

        header.classList.toggle('active');
        list.classList.toggle('active');
    });
});

if (burger && headerNav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('burger--active');
        headerNav.classList.toggle('header__navigation--active');
        burger.setAttribute('aria-expanded',
            burger.classList.contains('burger--active'));
    });

    headerNav.querySelectorAll('.navigation__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('burger--active');
            headerNav.classList.remove('header__navigation--active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}