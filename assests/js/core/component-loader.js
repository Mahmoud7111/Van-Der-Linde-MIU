/*
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENT LOADER SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * This file automatically loads reusable HTML components (header, footer, etc.)
 * into your pages so you don't have to copy/paste the same code everywhere.
 * 
 * HOW IT WORKS:
 * 1. You add a placeholder div in your HTML: <div id="header-placeholder"></div>
 * 2. This script fetches the component file (components/header.html)
 * 3. Inserts the HTML into the placeholder
 * 4. Automatically fixes all links to work from your page's location
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */


/*
 * ───────────────────────────────────────────────────────────────────────────
 * HELPER FUNCTION: getBasePath()
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Detects if the current page is in the root folder or a subfolder.
 * Returns the correct path prefix to reach the components folder.
 * 
 * Examples:
 * - If page is at:  /HomePage.html           → returns: ''
 * - If page is at:  /pages/shop.html         → returns: '../'
 * - If page is at:  /admin/dashboard.html    → returns: '../'
 * 
 * This ensures components load correctly from any page location.
 */
function getBasePath() {
    const path = window.location.pathname;
    
    // Check if we're inside a subfolder (pages/, admin/, etc.)
    // If yes, we need to go up one level with '../'
    return path.includes('/pages/') || path.includes('/admin/') ? '../' : '';
}


/*
 * ───────────────────────────────────────────────────────────────────────────
 * HELPER FUNCTION: fixInternalLinks()
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * After a component is loaded, this function fixes all links inside it
 * so they work correctly from the current page's location.
 * 
 * Example:
 * - Component has: <a href="pages/shop.html">Shop</a>
 * - Page is at root → Link stays: pages/shop.html ✅
 * - Page is in /pages → Link becomes: ../pages/shop.html ✅
 * 
 * NOTE: Only fixes relative links. External links (http://...) and 
 * anchor links (#...) are left unchanged.
 */
function fixInternalLinks(element) {
    const basePath = getBasePath();
    
    // If we're at root, no fixing needed
    if (!basePath) return;
    
    // Find all anchor tags (<a>) with href attributes
    element.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        
        // Only fix relative links (skip external URLs, anchors, mailto)
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            // Add the base path prefix (../)
            link.setAttribute('href', basePath + href);
        }
    });
}


/*
 * ───────────────────────────────────────────────────────────────────────────
 * CORE FUNCTION: loadComponent()
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Loads a single component file and inserts it into the page.
 * 
 * Parameters:
 * @param {string} componentPath - Path to component file (e.g., 'components/header.html')
 * @param {string} targetId - ID of the placeholder div to fill (e.g., 'header-placeholder')
 * 
 * Process:
 * 1. Calculates correct path based on page location
 * 2. Fetches the component HTML file
 * 3. Inserts HTML into the placeholder div
 * 4. Fixes all internal links
 * 5. Logs errors if component fails to load
 */
async function loadComponent(componentPath, targetId) {
    try {
        // Get the correct path prefix ('' or '../')
        const basePath = getBasePath();
        const fullPath = basePath + componentPath;
        
        // Fetch the component HTML file
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error(`Failed to load ${fullPath}`);
        
        // Get the HTML content
        const html = await response.text();
        
        // Find the placeholder div
        const element = document.getElementById(targetId);
        
        // Insert the component HTML
        element.innerHTML = html;
        
        // Fix all links inside the component
        fixInternalLinks(element);
        
    } catch (error) {
        // Log error to console if component fails to load
        console.error('Error loading component:', error);
    }
}

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENT REGISTRATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This section runs when the page finishes loading (DOMContentLoaded).
 * It checks for placeholder divs and loads the corresponding components.
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * 📝 FOR TEAMMATES: WHEN YOU CREATE A NEW COMPONENT
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Follow these steps to register a new component:
 * 
 * STEP 1: Create your component file
 *         Example: components/breadcrumb.html
 * 
 * STEP 2: Add a registration block below (copy/paste/modify an existing one)
 *         Example:
 *         
 *         // Load breadcrumb if placeholder exists
 *         if (document.getElementById('breadcrumb-placeholder')) {
 *             await loadComponent('components/breadcrumb.html', 'breadcrumb-placeholder');
 *         }
 * 
 * STEP 3: Use it in any page by adding the placeholder div
 *         Example: <div id="breadcrumb-placeholder"></div>
 * 
 * That's it! The component will automatically load on any page that has
 * the placeholder div.
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * 📝 FOR TEAMMATES: WHEN YOU CREATE A NEW PAGE
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * You DON'T need to edit this file!
 * 
 * Just add placeholder divs in your HTML:
 * 
 *     <div id="header-placeholder"></div>
 *     <main>Your content</main>
 *     <div id="footer-placeholder"></div>
 *     <script src="../assests/js/core/component-loader.js"></script>
 * 
 * The components will load automatically!
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Wait for the page to fully load before loading components
document.addEventListener('DOMContentLoaded', async function() {
    
    /*
     * ───────────────────────────────────────────────────────────────────────
     * CORE COMPONENTS (header, footer, loader)
     * ───────────────────────────────────────────────────────────────────────
     */
    
    // Load page loader (shows while page is loading)
    if (document.getElementById('loader-placeholder')) {
        await loadComponent('components/loader.html', 'loader-placeholder');
    }
    
    // Load header navigation (appears on all pages)
    if (document.getElementById('header-placeholder')) {
        await loadComponent('components/header.html', 'header-placeholder');
    }

    // Load footer (appears on all pages)
    if (document.getElementById('footer-placeholder')) {
        await loadComponent('components/footer.html', 'footer-placeholder');
    }

    
    /*
     * ───────────────────────────────────────────────────────────────────────
     * UTILITY COMPONENTS (currency, language, chat, etc.)
     * ───────────────────────────────────────────────────────────────────────
     */
    
    // Load currency switcher dropdown
    if (document.getElementById('currency-switcher-placeholder')) {
        await loadComponent('components/currency-switcher.html', 'currency-switcher-placeholder');
    }

    // Load language selector dropdown
    if (document.getElementById('language-selector-placeholder')) {
        await loadComponent('components/language-selector.html', 'language-selector-placeholder');
    }

    // Load dark mode toggle
    if (document.getElementById('dark-mode-toggle-placeholder')) {
        await loadComponent('components/darkmode.html', 'dark-mode-toggle-placeholder');
    }
    
    // Load live chat widget
    if (document.getElementById('chat-placeholder')) {
        await loadComponent('components/live-chat-widget.html', 'chat-placeholder');
    }

    // Load toast notification system
    if (document.getElementById('toast-placeholder')) {
        await loadComponent('components/toast-notification.html', 'toast-placeholder');
    }

    // Load email capture modal
    if (document.getElementById('email-modal-placeholder')) {
        await loadComponent('components/email-capture-modal.html', 'email-modal-placeholder');
    }

    
    /*
     * ───────────────────────────────────────────────────────────────────────
     * E-COMMERCE COMPONENTS (cart, filters, products)
     * ───────────────────────────────────────────────────────────────────────
     */
    
    // Load shopping cart sidebar
    if (document.getElementById('cart-offcanvas-placeholder')) {
        await loadComponent('components/cart-offcanvas.html', 'cart-offcanvas-placeholder');
    }
    
    // Load product filter sidebar (for shop pages)
    if (document.getElementById('product-filter-placeholder')) {
        await loadComponent('components/product-filter.html', 'product-filter-placeholder');
    }

    
    /*
     * ───────────────────────────────────────────────────────────────────────
     * 🆕 ADD YOUR NEW COMPONENTS HERE
     * ───────────────────────────────────────────────────────────────────────
     * 
     * Copy this template and modify it for your component:
     * 
     * // Load [component name] [when/where it's used]
     * if (document.getElementById('[your-component]-placeholder')) {
     *     await loadComponent('components/[your-component].html', '[your-component]-placeholder');
     * }
     * 
     * Example:
     * 
     * // Load breadcrumb navigation (for detail pages)
     * if (document.getElementById('breadcrumb-placeholder')) {
     *     await loadComponent('components/breadcrumb.html', 'breadcrumb-placeholder');
     * }
     * 
     */
    
    // ↓↓↓ ADD NEW COMPONENT REGISTRATIONS BELOW THIS LINE ↓↓↓
    
    
    
    // ↑↑↑ ADD NEW COMPONENT REGISTRATIONS ABOVE THIS LINE ↑↑↑
    

    /*
     * ───────────────────────────────────────────────────────────────────────
     * PAGE LOADER CLEANUP
     * ───────────────────────────────────────────────────────────────────────
     * Hide the loading spinner after all components have loaded
     */
    setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }, 1000);
    
});

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF COMPONENT LOADER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📚 For full documentation, see: COMPONENT-LOADER-GUIDE.md
 * ⚡ For quick reference, see: QUICK-REFERENCE.md
 * 
 * Need help? Ask your team! 🚀
 * ═══════════════════════════════════════════════════════════════════════════
 */