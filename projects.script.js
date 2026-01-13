// Scroll animation for Projects page

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.3
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(
        '.section-title, .section-subtitle, .project-card'
    ).forEach(el => projectObserver.observe(el));
});
// JavaScript Document