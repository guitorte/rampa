// Additional JavaScript functionality

// Form validation helpers
const validators = {
    phone: (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
    },
    
    date: (value) => {
        if (!value) return true; // Optional
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
    }
};

// Input masks
document.querySelectorAll('input[name="whatsapp"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        // Format as (XX) XXXXX-XXXX
        if (value.length > 7) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        
        e.target.value = value;
    });
});

// Real-time validation feedback
document.querySelectorAll('.input-field').forEach(field => {
    field.addEventListener('blur', () => {
        validateField(field);
    });
    
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            validateField(field);
        }
    });
});

function validateField(field) {
    const name = field.name;
    const value = field.value;
    let isValid = true;
    let message = '';
    
    // Remove previous error states
    field.classList.remove('error', 'border-red-500');
    field.classList.add('border-slate-200');
    
    // Required validation
    if (field.required && !value.trim()) {
        isValid = false;
        message = 'Este campo é obrigatório';
    }
    
    // Specific validations
    if (isValid && name === 'whatsapp' && value) {
        isValid = validators.phone(value);
        if (!isValid) message = 'Número de telefone inválido';
    }
    
    if (isValid && name === 'data' && value) {
        isValid = validators.date(value);
        if (!isValid) message = 'Data não pode ser no passado';
    }
    
    // Apply error state if invalid
    if (!isValid) {
        field.classList.remove('border-slate-200');
        field.classList.add('error', 'border-red-500');
        
        // Show error message (create if doesn't exist)
        let errorDiv = field.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-xs mt-1';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    } else {
        // Remove error message if exists
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();
    }
    
    return isValid;
}

// Lazy loading for sections
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                imageObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('section').forEach(section => {
        imageObserver.observe(section);
    });
}

// Service Worker registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Simple offline page caching could be implemented here
        console.log('App loaded and ready for offline capabilities');
    });
}

// Analytics simulation (privacy-friendly, just console logging)
function logEvent(eventName, data = {}) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Analytics] ${eventName}`, data);
    }
    // In production, this would send to analytics service
}

// Track form interactions
document.getElementById('booking-form').addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        logEvent('form_field_focus', { field: e.target.name });
    }
}, true);

// Track CTA clicks
document.querySelectorAll('.btn-primary, .whatsapp-float').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const isWhatsApp = btn.classList.contains('whatsapp-float') || btn.href?.includes('wa.me');
        logEvent('cta_click', { 
            type: isWhatsApp ? 'whatsapp' : 'form',
            location: btn.closest('section')?.id || 'header'
        });
    });
});

// Preload critical resources
function preloadResources() {
    const resources = [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=DM+Sans:wght@400;500;700&display=swap'
    ];
    
    resources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Initialize preloading after page load
window.addEventListener('load', preloadResources);

// Handle offline/online status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    // Could show a toast notification here
    console.log('Connection lost - some features may be unavailable');
});

// Date picker constraints (disable past dates)
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Performance monitoring
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log(`LCP: ${entry.startTime}ms`);
            }
            if (entry.entryType === 'first-input') {
                console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
            }
        }
    });
    
    try {
        perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (e) {
        console.log('Performance observer not supported');
    }
}
