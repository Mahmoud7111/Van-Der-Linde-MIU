# ⚡ Component Loader - Quick Reference

## 🎯 Basic Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page Title | Van der Linde</title>
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>
    <div id="header-placeholder"></div>
    
    <main>
        <!-- Your content here -->
    </main>
    
    <div id="footer-placeholder"></div>
    <script src="../assests/js/core/component-loader.js"></script>
</body>
</html>
```

## 📦 Available Placeholders

```html
<div id="loader-placeholder"></div>          <!-- Page loader -->
<div id="header-placeholder"></div>          <!-- Navigation -->
<div id="footer-placeholder"></div>          <!-- Footer -->
<div id="cart-offcanvas-placeholder"></div>  <!-- Cart sidebar -->
<div id="currency-switcher-placeholder"></div>
<div id="language-selector-placeholder"></div>
<div id="toast-placeholder"></div>           <!-- Notifications -->
<div id="chat-placeholder"></div>            <!-- Live chat -->
<div id="product-filter-placeholder"></div>  <!-- Filters -->
```

## 📍 Path Rules

**Root folder (HomePage.html):**
```html
<link rel="stylesheet" href="assets/css/main.css">
<script src="assests/js/core/component-loader.js"></script>
```

**Pages folder (pages/shop.html):**
```html
<link rel="stylesheet" href="../assets/css/main.css">
<script src="../assests/js/core/component-loader.js"></script>
```

## 🔧 Create New Component

1. **Create file:** `/components/my-component.html`
2. **Register in loader:** Edit `component-loader.js`:
   ```javascript
   if (document.getElementById('my-component-placeholder')) {
       await loadComponent('components/my-component.html', 'my-component-placeholder');
   }
   ```
3. **Use in page:** `<div id="my-component-placeholder"></div>`

## ⚠️ Must Use Local Server!

```powershell
# Python
python -m http.server 8000

# OR use VS Code "Live Server" extension
```

Open: `http://localhost:8000/HomePage.html`

## ✅ Quick Checklist

- [ ] Added placeholders for components
- [ ] Correct paths for CSS/JS
- [ ] component-loader.js before `</body>`
- [ ] Running local server
- [ ] Content inside `<main>` tags

---

**Full Guide:** See `COMPONENT-LOADER-GUIDE.md` for detailed instructions.
