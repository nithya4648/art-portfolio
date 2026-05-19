// Created and build by Nithyadharshini
// preloader
var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
    if (loader) {
        loader.style.display = "none";
    }
});

// High-Performance Consolidated Scrolling System (Non-blocking, passive & smooth)
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links li a");
const desktopHeader = document.querySelector('.header');
const mobileHeader = document.querySelector('.header1');
const theToggle = document.getElementById('toggle');
const menu = document.getElementById('menu');
const dynamicBg = document.getElementById('dynamic-bg');
const seaParticlesCanvas = document.getElementById('sea-particles');

let lastScrollTop = 0;
let scrollTicking = false;
let scrollTop = 0;

// Cache layout metrics to completely eliminate layout thrashing
let sectionOffsets = [];
let bodyHeight = 0;

function cacheLayoutMetrics() {
    bodyHeight = document.body.offsetHeight;
    sectionOffsets = Array.from(sections).map(section => {
        return {
            id: section.getAttribute("id"),
            top: section.offsetTop - 150,
            height: section.clientHeight
        };
    });
}

// Initial cache on script execution
cacheLayoutMetrics();
// Recache on resize and fully-loaded events (handles dynamic height changes once assets load)
window.addEventListener('load', cacheLayoutMetrics);
window.addEventListener('resize', cacheLayoutMetrics);

// Passive Scroll Event Listener
window.addEventListener("scroll", () => {
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (!scrollTicking) {
        requestAnimationFrame(updateScrollRender);
        scrollTicking = true;
    }
}, { passive: true });

function updateScrollRender() {
    let currentSection = "";
    const pageBottom = window.innerHeight + scrollTop;

    // 1. Section Activation (High-performance cached read)
    sectionOffsets.forEach((sec, index) => {
        if (index === sectionOffsets.length - 1 && pageBottom >= bodyHeight - 50) {
            currentSection = sec.id;
        } else if (scrollTop >= sec.top && scrollTop < sec.top + sec.height) {
            currentSection = sec.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").substring(1) === currentSection) {
            link.classList.add("active");
        }
    });

    // 2. Modern Nav Auto-Hide Logic
    const isAtBottom = (window.innerHeight + scrollTop) >= (document.documentElement.scrollHeight - 60);
    const isMenuOpen = menu && menu.classList.contains('show');

    if (scrollTop > lastScrollTop && scrollTop > 100 && !isAtBottom && !isMenuOpen) {
        // Scrolling Down
        if (desktopHeader) desktopHeader.classList.add('nav-hidden');
        if (mobileHeader) mobileHeader.classList.add('nav-hidden');
    } else {
        // Scrolling Up, reached the bottom, or menu is open
        if (desktopHeader) desktopHeader.classList.remove('nav-hidden');
        if (mobileHeader) mobileHeader.classList.remove('nav-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    // 3. Deep Sea Background (scrolls naturally with the page)
    if (dynamicBg) {
        // No translation or opacity effects applied to keep the background sticking to the landing page text
    }
    
    // 4. Sea Particles Fade logic
    if (seaParticlesCanvas) {
        if (scrollTop > 300) {
            let opacity = Math.min(1, (scrollTop - 300) / 500);
            seaParticlesCanvas.style.opacity = opacity;
        } else {
            seaParticlesCanvas.style.opacity = 0;
        }
    }

    scrollTicking = false;
}

// Sea Particles Animation Engine
let seaCtx = null;
let bubbles = [];

if (seaParticlesCanvas) {
    seaCtx = seaParticlesCanvas.getContext('2d');
    
    function resizeSea() {
        seaParticlesCanvas.width = window.innerWidth;
        seaParticlesCanvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeSea);
    resizeSea();

    class Bubble {
        constructor() {
            this.reset();
            this.y = Math.random() * seaParticlesCanvas.height;
        }
        reset() {
            this.x = Math.random() * seaParticlesCanvas.width;
            this.y = seaParticlesCanvas.height + 10;
            this.size = Math.random() * 3 + 1;
            this.speedY = (Math.random() * 1.5 + 0.8) * -1; // Faster upward float
            this.speedX = (Math.random() - 0.5) * 0.8; // More dynamic side sway
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < -10) {
                this.reset();
            }
        }
        draw() {
            seaCtx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`;
            seaCtx.beginPath();
            seaCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            seaCtx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        bubbles.push(new Bubble());
    }

    function animateSea() {
        seaCtx.clearRect(0, 0, seaParticlesCanvas.width, seaParticlesCanvas.height);
        bubbles.forEach(b => {
            b.update();
            b.draw();
        });
        requestAnimationFrame(animateSea);
    }
    animateSea();
}

// Mobile Navigation Toggle & Interactions
if (theToggle && menu) {
    // Toggle menu open/close
    theToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = menu.classList.contains('show');
        
        if (isOpen) {
            theToggle.classList.remove('on');
            menu.classList.remove('show');
            document.body.style.overflow = '';
        } else {
            theToggle.classList.add('on');
            menu.classList.add('show');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }
    });

    // Close menu when clicking a link
    const menuLinks = menu.querySelectorAll('.mobile-nav-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            theToggle.classList.remove('on');
            menu.classList.remove('show');
            document.body.style.overflow = '';
        });
    });
}

// --- Cinema-Grade Seamless Dual-Video Crossfade Loop ---
const video1 = document.getElementById('bg-video-1');
const video2 = document.getElementById('bg-video-2');

if (video1 && video2) {
    const crossfadeDuration = 1.5; // Match the 1.5s CSS transition duration
    let activeVideo = video1;
    let inactiveVideo = video2;
    let isCrossfading = false;

    // Ensure loop is removed so ended events are captured properly
    video1.removeAttribute('loop');
    video2.removeAttribute('loop');

    function checkCrossfade() {
        if (!activeVideo.duration) return;
        const remaining = activeVideo.duration - activeVideo.currentTime;

        // Trigger crossfade 1.5 seconds before the active video ends
        if (remaining <= crossfadeDuration && !isCrossfading) {
            isCrossfading = true;

            // Start playing the other video from the beginning
            inactiveVideo.currentTime = 0;
            inactiveVideo.play().then(() => {
                // Perform class swap to trigger CSS transition
                activeVideo.classList.remove('active');
                inactiveVideo.classList.add('active');

                // After crossfade finishes, pause the old video and update pointers
                setTimeout(() => {
                    activeVideo.pause();

                    const temp = activeVideo;
                    activeVideo = inactiveVideo;
                    inactiveVideo = temp;

                    isCrossfading = false;
                }, crossfadeDuration * 1000);
            }).catch((err) => {
                console.warn("Crossfade play failed:", err);
                isCrossfading = false;
            });
        }
    }

    video1.addEventListener('timeupdate', () => {
        if (activeVideo === video1) checkCrossfade();
    });

    video2.addEventListener('timeupdate', () => {
        if (activeVideo === video2) checkCrossfade();
    });
}
