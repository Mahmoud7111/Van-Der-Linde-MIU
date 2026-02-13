// Component Loader - Loads HTML components into pages

// Detect if we're in a subdirectory (like pages/) or root
function getBasePath() {
    const path = window.location.pathname;
    // If we're in a subfolder (like /pages/), go up one level
    return path.includes('/pages/') ? '../' : '';
}

// Fix internal links to work from current page location
function fixInternalLinks(element) {
    const basePath = getBasePath();
    if (!basePath) return; // No fix needed if we're at root
    
    // Fix all anchor tags
    element.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        // Only fix relative links (not external, not anchors)
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            link.setAttribute('href', basePath + href);
        }
    });
}

async function loadComponent(componentPath, targetId) {
    try {
        const basePath = getBasePath();
        const fullPath = basePath + componentPath;
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error(`Failed to load ${fullPath}`);
        const html = await response.text();
        const element = document.getElementById(targetId);
        element.innerHTML = html;
        
        // Fix internal links after loading
        fixInternalLinks(element);
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load all components when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Load header if placeholder exists
    if (document.getElementById('header-placeholder')) {
        await loadComponent('components/header.html', 'header-placeholder');
    }

    // Load footer if placeholder exists
    if (document.getElementById('footer-placeholder')) {
        await loadComponent('components/footer.html', 'footer-placeholder');
    }

    // Load loader if placeholder exists
    if (document.getElementById('loader-placeholder')) {
        await loadComponent('components/loader.html', 'loader-placeholder');
    }

    // Load live chat if placeholder exists
    if (document.getElementById('chat-placeholder')) {
        await loadComponent('components/live-chat-widget.html', 'chat-placeholder');
    }

    // Load currency switcher if placeholder exists
    if (document.getElementById('currency-switcher-placeholder')) {
        await loadComponent('components/currency-switcher.html', 'currency-switcher-placeholder');
    }

    // Load language selector if placeholder exists
    if (document.getElementById('language-selector-placeholder')) {
        await loadComponent('components/language-selector.html', 'language-selector-placeholder');
    }

    // Load email modal if placeholder exists
    if (document.getElementById('email-modal-placeholder')) {
        await loadComponent('components/email-capture-modal.html', 'email-modal-placeholder');
    }

    // Load toast notification if placeholder exists
    if (document.getElementById('toast-placeholder')) {
        await loadComponent('components/toast-notification.html', 'toast-placeholder');
    }

    // Load product filter if placeholder exists
    if (document.getElementById('product-filter-placeholder')) {
        await loadComponent('components/product-filter.html', 'product-filter-placeholder');
    }

    // Load cart offcanvas if placeholder exists
    if (document.getElementById('cart-offcanvas-placeholder')) {
        await loadComponent('components/cart-offcanvas.html', 'cart-offcanvas-placeholder');
    }

    // Hide page loader after everything loads
    setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) {
        loader.style.display = 'none';
        }
    }, 1000);
});