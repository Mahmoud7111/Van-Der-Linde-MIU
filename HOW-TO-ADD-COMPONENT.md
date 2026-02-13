# 📦 How to Add a New Component - Step by Step

## 🎯 Quick Example

Let's say you want to create a **breadcrumb navigation** component:

---

## ✅ Step 1: Create Component File

**Create:** `components/breadcrumb.html`

```html
<!-- BREADCRUMB COMPONENT -->
<nav class="breadcrumb">
    <a href="HomePage.html">Home</a>
    <span>/</span>
    <a href="pages/shop.html">Shop</a>
    <span>/</span>
    <span>Current Page</span>
</nav>
```

💡 **Note:** Write links as if you're linking from the root folder. The loader will auto-fix them!

---

## ✅ Step 2: Register in component-loader.js

**Open:** `assests/js/core/component-loader.js`

**Find this section:**
```javascript
// ↓↓↓ ADD NEW COMPONENT REGISTRATIONS BELOW THIS LINE ↓↓↓
```

**Add your component registration:**
```javascript
// Load breadcrumb navigation (for detail pages)
if (document.getElementById('breadcrumb-placeholder')) {
    await loadComponent('components/breadcrumb.html', 'breadcrumb-placeholder');
}
```

**Pattern:**
```javascript
// Load [component name] [optional: when/where it's used]
if (document.getElementById('[YOUR-ID]-placeholder')) {
    await loadComponent('components/[YOUR-FILE].html', '[YOUR-ID]-placeholder');
}
```

---

## ✅ Step 3: Use in Any Page

**In any HTML page:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Product Detail | Van der Linde</title>
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>
    <div id="header-placeholder"></div>
    
    <!-- 👇 Add your component placeholder -->
    <div id="breadcrumb-placeholder"></div>
    
    <main>
        <h1>Product Details</h1>
        <!-- your content -->
    </main>
    
    <div id="footer-placeholder"></div>
    <script src="../assests/js/core/component-loader.js"></script>
</body>
</html>
```

**That's it!** The breadcrumb will automatically load on any page that has `<div id="breadcrumb-placeholder"></div>`

---

## 🔑 Important Rules

### ✅ DO:
- Use descriptive placeholder IDs: `breadcrumb-placeholder`, `testimonials-placeholder`
- End all placeholder IDs with `-placeholder`
- Write links in components as if you're at the root folder
- Add comments explaining what the component does

### ❌ DON'T:
- Include `<link>` or `<script>` tags inside component files
- Use the same ID for different components
- Forget to register in component-loader.js
- Use absolute file paths (C:\Users\...)

---

## 📋 Registration Template

**Copy this and modify:**

```javascript
// Load [component name] [optional description]
if (document.getElementById('[your-component]-placeholder')) {
    await loadComponent('components/[your-file].html', '[your-component]-placeholder');
}
```

**Real examples:**

```javascript
// Load promotional banner (shows on homepage)
if (document.getElementById('promo-banner-placeholder')) {
    await loadComponent('components/promo-banner.html', 'promo-banner-placeholder');
}

// Load customer testimonials section
if (document.getElementById('testimonials-placeholder')) {
    await loadComponent('components/testimonials.html', 'testimonials-placeholder');
}

// Load size guide modal (for product pages)
if (document.getElementById('size-guide-placeholder')) {
    await loadComponent('components/size-guide.html', 'size-guide-placeholder');
}
```

---

## 🧪 Testing Your Component

1. **Create component file** → `components/your-component.html`
2. **Register in loader** → `assests/js/core/component-loader.js`
3. **Add placeholder to test page** → `<div id="your-component-placeholder"></div>`
4. **Run local server** → `python -m http.server 8000`
5. **Open in browser** → `http://localhost:8000/your-page.html`
6. **Check console** → Press F12, look for errors
7. **Verify component loaded** → You should see your component on the page!

---

## ❓ Troubleshooting

### Component doesn't load?
- ✅ Check placeholder ID matches registration
- ✅ Check file path is correct: `components/your-file.html`
- ✅ Make sure you saved component-loader.js
- ✅ Clear browser cache (Ctrl+F5)

### Links in component don't work?
- ✅ Write links as if you're at the root folder
- ✅ Don't use `../` in component files
- ✅ The loader fixes paths automatically

### Console shows errors?
- ✅ Press F12 and check the Console tab
- ✅ Error "Failed to load..." = wrong file path
- ✅ Error "Cannot read property..." = wrong placeholder ID

---

## 🎓 Summary

**To add a component:**
1. Create `components/your-component.html`
2. Register in `component-loader.js` (between the arrows ↓↓↓ and ↑↑↑)
3. Use `<div id="your-component-placeholder"></div>` in pages

**To use a component:**
- Just add `<div id="component-name-placeholder"></div>` in your HTML
- No need to edit component-loader.js!

---

**Questions?** Check the full guide: `COMPONENT-LOADER-GUIDE.md` 📚
