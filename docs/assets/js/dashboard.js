// Dashboard-specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Animate numbers on page load
    animateStats();
    
    // Update check times
    updateCheckTimes();
    setInterval(updateCheckTimes, 60000); // Update every minute
    
    // Code tab switching
    setupCodeTabs();
    
    // Animate lifecycle cards
    animateLifecycleCards();
});

function animateStats() {
    const stats = [
        { id: 'totalEnrollments', target: 247, duration: 1500 },
        { id: 'activeMilestones', target: 1234, duration: 1500 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateNumber(element, 0, stat.target, stat.duration);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    const isPercentage = originalText.includes('%');
    const isDollar = originalText.includes('$');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuad = t => t * (2 - t);
        const currentValue = start + (end - start) * easeOutQuad(progress);
        
        if (isPercentage) {
            element.textContent = currentValue.toFixed(1) + '%';
        } else if (isDollar) {
            element.textContent = '$' + currentValue.toFixed(2);
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function updateCheckTimes() {
    const times = {
        vrCheckTime: 2,
        a11yCheckTime: 5,
        workforceCheckTime: 1,
        securityCheckTime: 0.5
    };
    
    Object.entries(times).forEach(([id, minutes]) => {
        const element = document.getElementById(id);
        if (element) {
            if (minutes < 1) {
                element.textContent = Math.floor(minutes * 60) + ' seconds ago';
            } else if (minutes === 1) {
                element.textContent = '1 minute ago';
            } else {
                element.textContent = Math.floor(minutes) + ' minutes ago';
            }
        }
    });
}

function setupCodeTabs() {
    const tabs = document.querySelectorAll('.code-tab');
    const blocks = document.querySelectorAll('.code-block');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and blocks
            tabs.forEach(t => t.classList.remove('active'));
            blocks.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding block
            this.classList.add('active');
            const targetBlock = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        });
    });
}

function animateLifecycleCards() {
    const cards = document.querySelectorAll('.lifecycle-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ============================================================
// DEMO DATA SIMULATION
// ============================================================
// NOTE: This section simulates real-time data updates for demo purposes.
// In a production environment, replace this with actual API calls
// to fetch real compliance data from your backend.
// ============================================================
setInterval(() => {
    // Simulate minor fluctuations in enrollment numbers (demo only)
    const enrollments = document.getElementById('totalEnrollments');
    if (enrollments && Math.random() > 0.7) {
        const currentValue = parseInt(enrollments.textContent);
        enrollments.textContent = (currentValue + Math.floor(Math.random() * 3 - 1)).toString();
    }
    
    // Simulate progress bar updates (demo only)
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        if (Math.random() > 0.8) {
            const currentWidth = parseFloat(bar.style.width);
            const newWidth = Math.min(100, Math.max(0, currentWidth + (Math.random() * 2 - 1)));
            bar.style.width = newWidth + '%';
        }
    });
}, 5000);

// Keyboard navigation for code tabs
document.addEventListener('keydown', function(e) {
    const tabs = Array.from(document.querySelectorAll('.code-tab'));
    const activeTab = document.querySelector('.code-tab.active');
    const currentIndex = tabs.indexOf(activeTab);
    
    if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
        e.preventDefault();
        tabs[currentIndex + 1].click();
        tabs[currentIndex + 1].focus();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        tabs[currentIndex - 1].click();
        tabs[currentIndex - 1].focus();
    }
});
