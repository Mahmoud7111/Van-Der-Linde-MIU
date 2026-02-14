# 🚀 Component Loader System Guide

## 📖 What is This?

The Component Loader is a system that lets you **reuse HTML components** (like headers, footers, navigation) across all pages **without copying code**. Write once, use everywhere!

---

## ✅ Benefits

- ✨ **No Code Duplication**: Write header/footer once, use on all pages
- 🔄 **Easy Updates**: Change header once, updates everywhere automatically
- 🧹 **Cleaner Code**: Pages are shorter and easier to maintain
- 🎯 **Consistent Design**: Same components everywhere = consistent look

---

## 🏗️ How It Works

1. **Components** are stored in the `/components` folder (header.html, footer.html, etc.)
2. **Pages** have placeholder `<div>` elements with specific IDs
3. **component-loader.js** automatically fetches components and inserts them into placeholders
4. **Links are auto-fixed** to work from any page location

---

## 📝 How to Create a New Page

### Step 1: Copy This Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title | Van der Linde</title>
    
    <!-- CSS - Adjust path based on location -->
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>
    
    <!-- COMPONENTS - These load automatically! Just add the placeholder -->
    <div id="loader-placeholder"></div>
    <div id="header-placeholder"></div>

    <!-- YOUR PAGE CONTENT -->
    <main>
        <h1>Your Page Title</h1>
        <p>Add your page-specific content here!</p>
    </main>

    <!-- COMPONENTS - Footer and utilities -->
    <div id="footer-placeholder"></div>
    <div id="currency-switcher-placeholder"></div>
    <div id="language-selector-placeholder"></div>
    <div id="cart-offcanvas-placeholder"></div>
    <div id="toast-placeholder"></div>
    <div id="chat-placeholder"></div>

    <!-- Load Component System -->
    <script src="../assests/js/core/component-loader.js"></script>
    
    <!-- Your page-specific JavaScript (optional) -->
    <script src="../assets/js/your-page.js"></script>
</body>
</html>
```

### Step 2: Adjust Paths

**If your page is in the ROOT folder** (like `HomePage.html`):
```html
<link rel="stylesheet" href="assets/css/main.css">
<script src="assests/js/core/component-loader.js"></script>
```

**If your page is in `/pages` folder**:
```html
<link rel="stylesheet" href="../assets/css/main.css">
<script src="../assests/js/core/component-loader.js"></script>
```

### Step 3: Add Your Content

Only write the content that's unique to your page. Put it inside `<main>` tags.

---

## 🧩 Available Components

Add these placeholder IDs to load components automatically:

| Placeholder ID | What It Loads | Required? |
|---------------|---------------|-----------|
| `header-placeholder` | Navigation header | ✅ Yes |
| `footer-placeholder` | Footer with links | ✅ Yes |
| `loader-placeholder` | Page loading animation | Recommended |
| `cart-offcanvas-placeholder` | Shopping cart sidebar | For shop pages |
| `currency-switcher-placeholder` | Currency dropdown | Optional |
| `language-selector-placeholder` | Language dropdown | Optional |
| `toast-placeholder` | Toast notifications | Optional |
| `chat-placeholder` | Live chat widget | Optional |
| `product-filter-placeholder` | Product filters | For shop pages |

### Example: Basic Page
```html
<div id="header-placeholder"></div>
<main>Your content</main>
<div id="footer-placeholder"></div>
<script src="../assests/js/core/component-loader.js"></script>
```

### Example: Shop Page
```html
<div id="loader-placeholder"></div>
<div id="header-placeholder"></div>
<main>
    <div id="product-filter-placeholder"></div>
    <!-- Product grid here -->
</main>
<div id="footer-placeholder"></div>
<div id="cart-offcanvas-placeholder"></div>
<div id="toast-placeholder"></div>
<script src="../assests/js/core/component-loader.js"></script>
```

---

## 🆕 How to Create a New Component

### Step 1: Create HTML File

Save your component in `/components/your-component.html`

**Example: `/components/promo-banner.html`**
```html
<!-- PROMO BANNER COMPONENT -->
<div class="promo-banner">
    <p>🎉 Free shipping on orders over $500!</p>
</div>
```

### Step 2: Register Component in Loader

Edit `/assests/js/core/component-loader.js` and add your component:

```javascript
// Add this inside the DOMContentLoaded event listener:

// Load promo banner if placeholder exists
if (document.getElementById('promo-banner-placeholder')) {
    await loadComponent('components/promo-banner.html', 'promo-banner-placeholder');
}
```

### Step 3: Use Component in Pages

```html
<div id="promo-banner-placeholder"></div>
```

---

## 🔗 About Links in Components

### ✅ Links are Auto-Fixed!

The component loader automatically fixes links so they work from any page location.

**In your component files**, write links as if you're linking **FROM THE ROOT**:

```html
<!-- In components/header.html -->
<a href="HomePage.html">Home</a>
<a href="pages/shop.html">Shop</a>
<a href="pages/about.html">About</a>
```

The loader will automatically adjust these:
- From root (`HomePage.html`): Links stay as-is
- From `/pages` folder: Links become `../HomePage.html`, `shop.html`, etc.

---

## 🚨 Important Notes

### ⚠️ You MUST Use a Local Server

The component loader uses `fetch()` which **doesn't work** with `file://` protocol.

**Run a local server:**

**Option 1: Python (if installed)**
```powershell
cd "C:\Users\asus\Desktop\Projects\Web Project\Van Der Linde-MIU"
python -m http.server 8000
```
Then open: `http://localhost:8000/HomePage.html`

**Option 2: VS Code Live Server Extension**
1. Install "Live Server" extension in VS Code
2. Right-click on `HomePage.html`
3. Select "Open with Live Server"

**Option 3: Node.js http-server**
```powershell
npm install -g http-server
http-server -p 8000
```

### ⚠️ CSS/JS Paths in Components

Components are loaded into the page's HTML, so **don't** include `<link>` or `<script>` tags in component files. Only include HTML markup.

❌ **Don't do this in components:**
```html
<!-- components/header.html -->
<link rel="stylesheet" href="style.css">  <!-- NO! -->
<header>...</header>
```

✅ **Do this instead:**
```html
<!-- components/header.html -->
<header>...</header>

<!-- HomePage.html -->
<head>
    <link rel="stylesheet" href="assets/css/main.css">
</head>
```

---

## 📂 File Structure

```
Van-Der-Linde-MIU/
├── HomePage.html                    (uses component loader)
├── page-template.html               (template for new pages)
├── components/
│   ├── header.html                  ✅ Reusable component
│   ├── footer.html                  ✅ Reusable component
│   ├── loader.html
│   ├── cart-offcanvas.html
│   ├── currency-switcher.html
│   ├── language-selector.html
│   └── ... (other components)
├── pages/
│   ├── shop.html                    (uses component loader)
│   ├── about.html
│   └── ... (other pages)
├── assests/
│   └── js/
│       └── core/
│           └── component-loader.js  🔧 The magic file
└── assets/
    └── css/
        └── main.css
```

---

## 🎯 Quick Checklist

When creating a new page:

- [ ] Copy template from `page-template.html`
- [ ] Update page title and meta tags
- [ ] Add placeholder divs for components you need
- [ ] Adjust CSS/JS paths based on page location
- [ ] Add component-loader.js script before closing body tag
- [ ] Write your page-specific content inside `<main>`
- [ ] Test with local server (not `file://`)

---

## 💡 Pro Tips

1. **Test in Multiple Locations**: Test your page from root AND /pages folder to ensure paths work
2. **Check Console**: Open browser DevTools (F12) → Console to see if components loaded successfully
3. **Component Not Loading?**: Check the placeholder ID matches what's in component-loader.js
4. **Styling Issues?**: Remember, component styling comes from main.css, not from component files

---

## 🆘 Troubleshooting

### Components Not Loading?

**Problem**: Components don't appear on page
- ✅ Check if you're using a local server (not `file://`)
- ✅ Check placeholder ID is correct (e.g., `header-placeholder`)
- ✅ Open browser console (F12) and look for errors
- ✅ Check path to component-loader.js is correct

### Links Not Working?

**Problem**: Clicking links in header/footer gives 404
- ✅ Make sure component-loader.js is loaded AFTER components
- ✅ Check your local server is running
- ✅ Verify file paths are correct in components

### Styling Not Applied?

**Problem**: Components load but have no styling
- ✅ Check if main.css is loaded in your page's `<head>`
- ✅ Make sure CSS path is correct for page location
- ✅ Clear browser cache (Ctrl+F5)

---

## 📞 Need Help?

If you run into issues:
1. Check browser console for errors (F12 → Console)
2. Verify file paths are correct
3. Make sure local server is running
4. Ask the team for help!

---

## ✨ Example: Complete Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us | Van der Linde</title>
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>
    
    <!-- Components load automatically -->
    <div id="loader-placeholder"></div>
    <div id="header-placeholder"></div>

    <!-- Your unique content -->
    <main>
        <section class="about-hero">
            <h1>About Van der Linde</h1>
            <p>Crafting luxury timepieces since 1895</p>
        </section>
        
        <section class="about-story">
            <h2>Our Story</h2>
            <p>Your content here...</p>
        </section>
    </main>

    <!-- Components -->
    <div id="footer-placeholder"></div>
    <div id="chat-placeholder"></div>
    <div id="toast-placeholder"></div>

    <!-- Load the magic -->
    <script src="../assests/js/core/component-loader.js"></script>
</body>
</html>
```

**That's it!** You now have a page with a full header, footer, and utilities without copying any code! 🎉

---

**Happy Coding! 🚀**
