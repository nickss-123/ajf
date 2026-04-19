// ================= PASSWORD GATE =================
document.addEventListener('DOMContentLoaded', function() {
    const passwordOverlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const submitBtn = document.getElementById('password-submit');
    const errorDiv = document.getElementById('password-error');
    
    // Set your desired password here
    const SECRET_PASSWORD = "APRIL2026";
    
    function unlockWebsite() {
        passwordOverlay.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Start music automatically after password (user gesture)
        const audio = document.getElementById('birthday-music');
        if (audio) {
            audio.play().catch(e => console.log("Autoplay blocked:", e));
            // update floating button state to playing
            updateMusicButtonState(true);
        }
        
        // Initialize all features
        initCountdown();
        initFloatingMessages();
        initMusicControls();
        initConfetti();
        initNavbar();
    }
    
    function checkPassword() {
        const entered = passwordInput.value.trim();
        if (entered === SECRET_PASSWORD) {
            unlockWebsite();
        } else {
            errorDiv.textContent = "❌ Incorrect password. Please try again.";
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    submitBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkPassword();
    });
});

// ================= COUNTDOWN TIMER =================
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    
    function updateCountdown() {
        const now = new Date();
        const target = new Date(2026, 3, 17); // April 17, 2026
        const diff = target - now;
        
        if (diff <= 0) {
            countdownEl.innerHTML = "🎉 It's your birthday, April Joy! Let's celebrate! 🎉";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / (3600000));
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        countdownEl.innerHTML = `🎂 ${days}d ${hours}h ${minutes}m ${seconds}s until your big day! 🎂`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ================= FLOATING MESSAGES ON PHOTO CLICK =================
function initFloatingMessages() {
    function showFloatingMessage(msg, x, y) {
        const bubble = document.createElement('div');
        bubble.className = 'floating-message';
        bubble.textContent = msg;
        bubble.style.left = (x + 15) + 'px';
        bubble.style.top = (y - 40) + 'px';
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 8000);
    }
    
    const allPhotos = document.querySelectorAll('.wish-photo img');
    allPhotos.forEach(img => {
        img.addEventListener('click', function(e) {
            let message = this.dataset.message;
            if (!message) message = this.alt || 'Happy birthday, April Joy! 💖';
            showFloatingMessage(message, e.clientX, e.clientY);
        });
    });
}

// ================= FLOATING MUSIC BUTTON CONTROLS =================
let isMusicPlaying = false;

function updateMusicButtonState(isPlaying) {
    const btn = document.getElementById('floating-music-btn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    const tooltip = btn.querySelector('.music-tooltip');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
        tooltip.textContent = 'Pause Music';
    } else {
        icon.className = 'fas fa-music';
        tooltip.textContent = 'Play Birthday Melody';
    }
}

function initMusicControls() {
    const audio = document.getElementById('birthday-music');
    const floatingBtn = document.getElementById('floating-music-btn');
    if (!audio || !floatingBtn) return;
    
    // Sync state after autoplay attempt
    audio.addEventListener('play', () => {
        isMusicPlaying = true;
        updateMusicButtonState(true);
    });
    audio.addEventListener('pause', () => {
        isMusicPlaying = false;
        updateMusicButtonState(false);
    });
    
    floatingBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.log("Playback failed:", e));
        }
    });
}

// ================= CONFETTI (for Celebrate button) =================
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let animationId = null;
    let active = false;
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function createParticle() {
        return {
            x: random(0, width),
            y: random(-height, 0),
            size: random(5, 12),
            speedY: random(3, 8),
            speedX: random(-1, 1),
            color: `hsl(${random(0, 360)}, 70%, 60%)`,
            rotation: random(0, 360),
            rotationSpeed: random(-5, 5)
        };
    }
    
    function drawParticle(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
    }
    
    function updateParticle(p) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        return p.y < height + p.size;
    }
    
    function animate() {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            const keep = updateParticle(particles[i]);
            if (keep) {
                drawParticle(particles[i]);
            } else {
                particles[i] = createParticle();
            }
        }
        animationId = requestAnimationFrame(animate);
    }
    
    function startConfetti(duration = 2500) {
        if (active) return;
        active = true;
        resizeCanvas();
        particles = [];
        for (let i = 0; i < 150; i++) {
            particles.push(createParticle());
        }
        animate();
        setTimeout(() => {
            active = false;
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, width, height);
        }, duration);
    }
    
    const celebrateBtn = document.getElementById('celebrateBtn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', () => startConfetti(2500));
    }
}

// ================= NAVBAR ACTIVE LINK & SMOOTH SCROLL =================
function initNavbar() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function setActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 100; // offset for navbar
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // initial
    
    // Smooth scroll on click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}