// Global state
let isTechnicalMode = false;

// Toggle technical mode
function toggleDetails() {
    isTechnicalMode = !isTechnicalMode;
    document.body.classList.toggle('technical-mode', isTechnicalMode);
    
    const technicalSection = document.getElementById('technical-section');
    const storySection = document.getElementById('story-section');
    
    if (isTechnicalMode) {
        technicalSection.classList.remove('hidden');
        storySection.classList.add('mb-8');
        
        // Show all technical slots in timeline
        document.querySelectorAll('timeline-item').forEach(item => {
            item.showTechnical();
        });
        
        // Scroll to technical section
        setTimeout(() => {
            technicalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        technicalSection.classList.add('hidden');
        storySection.classList.remove('mb-8');
        
        // Hide all technical slots
        document.querySelectorAll('timeline-item').forEach(item => {
            item.hideTechnical();
        });
    }
    
    // Update button text
    const btn = document.querySelector('header button');
    if (btn) {
        btn.innerHTML = isTechnicalMode ? 
            '<i data-feather="x" class="w-4 h-4"></i><span>Modo Simples</span>' : 
            '<i data-feather="info" class="w-4 h-4"></i><span>Modo Técnico</span>';
        feather.replace();
    }
}

// Quiz functionality
function checkAnswer(button, isCorrect) {
    const container = button.parentElement;
    const feedback = document.getElementById('quiz-feedback');
    
    // Reset all buttons
    container.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('quiz-correct', 'quiz-wrong');
        btn.disabled = true;
        btn.style.opacity = '0.7';
    });
    
    // Highlight selected
    if (isCorrect) {
        button.classList.add('quiz-correct');
        button.style.opacity = '1';
        feedback.innerHTML = '<strong>Correto!</strong> Somente parlamentares federais (deputados e senadores) podem apresentar emendas à Lei Orçamentária.';
        feedback.className = 'mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-white';
    } else {
        button.classList.add('quiz-wrong');
        feedback.innerHTML = '<strong>Quase lá!</strong> Apesar de cidadãos e prefeitos participarem do processo (solicitando), apenas deputados federais e senadores têm o poder de apresentar emendas formais.';
        feedback.className = 'mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-white';
        
        // Highlight correct answer
        container.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.includes('deputados federais')) {
                btn.classList.add('quiz-correct');
                btn.style.opacity = '1';
            }
        });
    }
    
    feedback.classList.remove('hidden');
}

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all timeline items
    document.querySelectorAll('timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        setTimeout(() => {
            observer.observe(item);
        }, index * 100);
    });
});

// Handle share functionality (mobile)
function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: 'EmendaFácil',
            text: 'Entenda como funcionam as Emendas Parlamentares no Brasil de forma simples!',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Simple service worker for offline capability
        const swContent = `
            self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
            self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
            self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));
        `;
        
        // Note: In a real deployment, this would be a separate file
        // For this demo, we're just preparing the structure
    });
}