// Integration Guide JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add highlighting to code blocks on click
    document.querySelectorAll('pre code').forEach(block => {
        block.parentElement.addEventListener('click', function() {
            const range = document.createRange();
            range.selectNodeContents(block);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });
});
