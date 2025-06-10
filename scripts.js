// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Create intersection observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Project section specific observer
let currentProjectIndex = 0;
const projects = document.querySelectorAll('.project-box');
const projectsSection = document.getElementById('projects');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            handleProjectTransitions();
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px'
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupSmoothScrolling();
    setupFormSubmission();
});

function initializeAnimations() {
    // Observe section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => observer.observe(title));

    // Observe about content
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) observer.observe(aboutContent);

    // Observe skill cards with staggered animation
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        observer.observe(card);
        
        // Add collision effect after slide animation
        setTimeout(() => {
            if (card.classList.contains('animate')) {
                card.classList.add('collide');
            }
        }, 800 + (index * 100));
    });

    // Observe contact form
    const contactForm = document.querySelector('.contact-form-container');
    if (contactForm) observer.observe(contactForm);

    // Observe projects section
    if (projectsSection) {
        projectObserver.observe(projectsSection);
    }
}

function handleProjectTransitions() {
    let scrollProgress = 0;
    
    const projectsScrollHandler = () => {
        const rect = projectsSection.getBoundingClientRect();
        const sectionHeight = projectsSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress within the projects section
        if (rect.top <= 0 && rect.bottom >= windowHeight) {
            scrollProgress = Math.abs(rect.top) / (sectionHeight - windowHeight);
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));
            
            // Determine which project should be visible
            const targetIndex = Math.floor(scrollProgress * projects.length);
            
            if (targetIndex !== currentProjectIndex && targetIndex < projects.length) {
                transitionToProject(targetIndex);
            }
        }
    };
    
    // Add scroll listener for project transitions
    window.addEventListener('scroll', projectsScrollHandler);
    
    // Initial project setup
    projects.forEach((project, index) => {
        if (index === 0) {
            project.classList.add('active');
        } else {
            project.classList.remove('active');
        }
    });
}

function transitionToProject(newIndex) {
    const currentProject = projects[currentProjectIndex];
    const newProject = projects[newIndex];
    
    if (currentProject && newProject) {
        // Hide current project
        currentProject.classList.add('hidden');
        currentProject.classList.remove('active');
        
        // Show new project after a delay
        setTimeout(() => {
            currentProject.classList.remove('hidden');
            newProject.classList.add('active');
            currentProjectIndex = newIndex;
        }, 400);
    }
}

function setupSmoothScrolling() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                reason: formData.get('reason')
            };
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#27ae60';
                
                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '#2C3E50';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
            
            // Console log for demonstration
            console.log('Form submitted with data:', data);
        });
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add active nav item highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// Enhanced skill card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const heroTitle = document.getElementById('heroTitle');
            const heroSubtitle = document.getElementById('heroSubtitle');
            
            setTimeout(() => {
                typeWriter(heroTitle, 'Tino Paul', 150);
            }, 1000);
            
            setTimeout(() => {
                typeWriter(heroSubtitle, 'Full Stack Developer & UI/UX Designer', 50);
            }, 2500);
            
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const hero = document.querySelector('.hero');
if (hero) {
    heroObserver.observe(hero);
}function setupFormSubmission() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const reason = document.getElementById('reason').value.trim();

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                await db.collection('supportMessages').add({
                    name,
                    phone,
                    address,
                    reason,
                    timestamp: new Date()
                });

                submitBtn.textContent = 'Message Sent!';
                this.reset();
            } catch (error) {
                console.error("Firestore Error:", error);
                submitBtn.textContent = 'Send Failed!';
            }

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}
