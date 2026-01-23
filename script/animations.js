const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
};

const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

const animatedElements = [
    ...document.querySelectorAll('.section-header'),
    ...document.querySelectorAll('.about__image'),
    ...document.querySelectorAll('.about__paragraph'),
    ...document.querySelectorAll('.service-card'),
    ...document.querySelectorAll('.skills__category'),
];

animatedElements.forEach(element => {
    scrollObserver.observe(element);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero__stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.hero__stat-number');

    statNumbers.forEach(stat => {
        const finalText = stat.textContent;
        const finalNum = parseInt(finalText);

        if (isNaN(finalNum)) return;

        const suffix = finalText.replace(/[\d]/g, '');
        const duration = 1500;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = Math.floor(easeProgress * finalNum);

            stat.textContent = currentNum + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = finalText;
            }
        }

        requestAnimationFrame(updateNumber);
    });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration-fast', '0.01ms');
    document.documentElement.style.setProperty('--animation-duration-normal', '0.01ms');
    document.documentElement.style.setProperty('--animation-duration-slow', '0.01ms');
    document.documentElement.style.setProperty('--animation-duration-slower', '0.01ms');

    animatedElements.forEach(el => el.classList.add('is-visible'));
}
