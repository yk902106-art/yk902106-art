// Global variables
let userData = {};

// DOM Elements
const registrationModal = document.getElementById('registrationModal');
const registrationForm = document.getElementById('registrationForm');

// Show registration modal
function showRegistration() {
    if (registrationModal) {
        registrationModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Hide registration modal
function hideRegistration() {
    if (registrationModal) {
        registrationModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === registrationModal) {
        hideRegistration();
    }
}

// Handle registration form submission
if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(registrationForm);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            showNotification('الرجاء ملء جميع الحقول', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('كلمتا المرور غير متطابقتين', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'error');
            return;
        }
        
        // Store user data
        userData.fullName = fullName;
        userData.email = email;
        userData.password = password;
        
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        showNotification('تم إنشاء الحساب بنجاح!', 'success');
        
        // Redirect to form page after a short delay
        setTimeout(() => {
            window.location.href = 'form.html';
        }, 1500);
    });
}

// --- NEW: Modern Notification Function ---
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    let iconClass = 'fa-info-circle';
    let accentClass = 'info';
    
    if (type === 'success') {
        iconClass = 'fa-check-circle';
        accentClass = 'success';
    } else if (type === 'error') {
        iconClass = 'fa-exclamation-circle';
        accentClass = 'error';
    }

    notification.innerHTML = `
        <div class="notification-accent ${accentClass}"></div>
        <div class="notification-content">
            <i class="fas ${iconClass}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// --- NEW: Hero Canvas Animation (for index.html) ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.01;
            }
            draw() {
                ctx.fillStyle = 'rgba(0, 242, 96, 0.5)'; // Accent Green
                ctx.strokeStyle = 'rgba(5, 117, 230, 0.5)'; // Accent Blue
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        }
        init();

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                    particles.push(new Particle());
                }
            }
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            init();
        });
    }
});

// --- NEW: Scroll-Triggered Animations (Global) ---
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const targets = document.querySelectorAll(
        '.hero-text, .hero-image-placeholder, .category-card, .form-section, .portfolio-section, .project-card, .experience-item, .form-header, .categories-header'
    );

    targets.forEach(target => {
        target.classList.add('animate-on-scroll');
        observer.observe(target);
    });
});


// Utility functions (Unchanged)
function saveFormData(data) {
    const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedData = { ...existingData, ...data };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    return updatedData;
}
function getFormData() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
}
function clearFormData() {
    localStorage.removeItem('userData');
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function validateURL(url) {
    try { new URL(url); return true; } catch { return false; }
}
function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}
