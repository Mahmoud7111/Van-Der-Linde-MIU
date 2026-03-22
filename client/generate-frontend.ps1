# ============================================================
# Watch Brand — Full Frontend Structure Generator
# Run this inside your client/ folder in VS Code terminal
# Command: .\generate-frontend.ps1
# ============================================================

$folders = @(
  "src\api",
  "src\assets\icons",
  "src\assets\images",
  "src\components\cart",
  "src\components\common",
  "src\components\features",
  "src\components\layout",
  "src\components\product",
  "src\components\checkout",
  "src\components\admin",
  "src\context",
  "src\data",
  "src\hooks",
  "src\pages\account",
  "src\pages\admin",
  "src\pages\cart",
  "src\pages\configurator",
  "src\pages\home",
  "src\pages\info",
  "src\pages\product",
  "src\pages\quiz",
  "src\pages\shop",
  "src\routes",
  "src\services",
  "src\styles",
  "src\utils"
)

$files = @(
  # ── Root src files ──────────────────────────────────────────
  "src\main.jsx",

  # ── API ─────────────────────────────────────────────────────
  "src\api\axiosInstance.js",

  # ── Assets ──────────────────────────────────────────────────
  "src\assets\logo.svg",
  "src\assets\icons\cart.svg",
  "src\assets\icons\heart.svg",
  "src\assets\icons\search.svg",
  "src\assets\icons\user.svg",
  "src\assets\icons\menu.svg",
  "src\assets\icons\close.svg",
  "src\assets\icons\star.svg",
  "src\assets\icons\arrow.svg",
  "src\assets\images\hero-watch.jpg",
  "src\assets\images\watch-placeholder.jpg",

  # ── Components — cart ────────────────────────────────────────
  "src\components\cart\CartOffcanvas.jsx",
  "src\components\cart\CartOffcanvas.css",
  "src\components\cart\CartItem.jsx",
  "src\components\cart\CartItem.css",
  "src\components\cart\CartSummary.jsx",
  "src\components\cart\CartSummary.css",

  # ── Components — common ──────────────────────────────────────
  "src\components\common\Loader.jsx",
  "src\components\common\Loader.css",
  "src\components\common\Modal.jsx",
  "src\components\common\Modal.css",
  "src\components\common\Toast.jsx",
  "src\components\common\Toast.css",
  "src\components\common\Button.jsx",
  "src\components\common\Button.css",
  "src\components\common\Badge.jsx",
  "src\components\common\Badge.css",
  "src\components\common\EmptyState.jsx",
  "src\components\common\EmptyState.css",
  "src\components\common\StarRating.jsx",
  "src\components\common\StarRating.css",
  "src\components\common\PageTransition.jsx",
  "src\components\common\SkeletonCard.jsx",
  "src\components\common\SkeletonCard.css",

  # ── Components — features ────────────────────────────────────
  "src\components\features\CurrencySwitcher.jsx",
  "src\components\features\CurrencySwitcher.css",
  "src\components\features\DarkModeToggle.jsx",
  "src\components\features\DarkModeToggle.css",
  "src\components\features\EmailCaptureModal.jsx",
  "src\components\features\EmailCaptureModal.css",
  "src\components\features\SearchBar.jsx",
  "src\components\features\SearchBar.css",
  "src\components\features\FluidCursor.jsx",
  "src\components\features\FluidCursor.css",

  # ── Components — layout ──────────────────────────────────────
  "src\components\layout\Layout.jsx",
  "src\components\layout\Header.jsx",
  "src\components\layout\Header.css",
  "src\components\layout\Footer.jsx",
  "src\components\layout\Footer.css",
  "src\components\layout\Breadcrumb.jsx",
  "src\components\layout\Breadcrumb.css",
  "src\components\layout\MobileMenu.jsx",
  "src\components\layout\MobileMenu.css",

  # ── Components — product ─────────────────────────────────────
  "src\components\product\ProductCard.jsx",
  "src\components\product\ProductCard.css",
  "src\components\product\ProductGrid.jsx",
  "src\components\product\ProductGrid.css",
  "src\components\product\ProductFilter.jsx",
  "src\components\product\ProductFilter.css",
  "src\components\product\ProductImageGallery.jsx",
  "src\components\product\ProductImageGallery.css",
  "src\components\product\ProductRating.jsx",
  "src\components\product\ProductRating.css",
  "src\components\product\ReviewCard.jsx",
  "src\components\product\ReviewCard.css",
  "src\components\product\ReviewForm.jsx",
  "src\components\product\ReviewForm.css",

  # ── Components — checkout ────────────────────────────────────
  "src\components\checkout\CheckoutSteps.jsx",
  "src\components\checkout\CheckoutSteps.css",
  "src\components\checkout\ShippingForm.jsx",
  "src\components\checkout\ShippingForm.css",
  "src\components\checkout\PaymentForm.jsx",
  "src\components\checkout\PaymentForm.css",
  "src\components\checkout\OrderReview.jsx",
  "src\components\checkout\OrderReview.css",

  # ── Components — admin ───────────────────────────────────────
  "src\components\admin\StatsCard.jsx",
  "src\components\admin\StatsCard.css",
  "src\components\admin\DataTable.jsx",
  "src\components\admin\DataTable.css",
  "src\components\admin\WatchForm.jsx",
  "src\components\admin\WatchForm.css",
  "src\components\admin\OrderStatusBadge.jsx",
  "src\components\admin\OrderStatusBadge.css",
  "src\components\admin\OrderStatusStepper.jsx",
  "src\components\admin\OrderStatusStepper.css",

  # ── Context ──────────────────────────────────────────────────
  "src\context\AuthContext.jsx",
  "src\context\CartContext.jsx",
  "src\context\ThemeContext.jsx",
  "src\context\CurrencyContext.jsx",
  "src\context\LanguageContext.jsx",
  "src\context\WishlistContext.jsx",

  # ── Data (mock) ──────────────────────────────────────────────
  "src\data\products.json",
  "src\data\collections.json",
  "src\data\brands.json",
  "src\data\orders.json",
  "src\data\user.json",
  "src\data\faq.json",
  "src\data\quiz-questions.json",
  "src\data\testimonials.json",
  "src\data\translations.json",

  # ── Hooks ────────────────────────────────────────────────────
  "src\hooks\useDebounce.js",
  "src\hooks\useLocalStorage.js",
  "src\hooks\useMediaQuery.js",
  "src\hooks\useClickOutside.js",
  "src\hooks\useScrollPosition.js",
  "src\hooks\useWatches.js",

  # ── Pages — account ──────────────────────────────────────────
  "src\pages\account\LoginPage.jsx",
  "src\pages\account\RegisterPage.jsx",
  "src\pages\account\ForgotPasswordPage.jsx",
  "src\pages\account\ResetPasswordPage.jsx",
  "src\pages\account\AccountPage.jsx",
  "src\pages\account\AccountPage.css",
  "src\pages\account\OrderHistoryPage.jsx",
  "src\pages\account\OrderHistoryPage.css",
  "src\pages\account\WishlistPage.jsx",
  "src\pages\account\WishlistPage.css",
  "src\pages\account\AuthPage.css",

  # ── Pages — admin ────────────────────────────────────────────
  "src\pages\admin\AdminDashboard.jsx",
  "src\pages\admin\ManageProducts.jsx",
  "src\pages\admin\ManageOrders.jsx",
  "src\pages\admin\AdminPage.css",

  # ── Pages — cart ─────────────────────────────────────────────
  "src\pages\cart\CartPage.jsx",
  "src\pages\cart\CartPage.css",
  "src\pages\cart\CheckoutPage.jsx",
  "src\pages\cart\CheckoutPage.css",
  "src\pages\cart\OrderConfirmationPage.jsx",
  "src\pages\cart\OrderConfirmationPage.css",

  # ── Pages — configurator ─────────────────────────────────────
  "src\pages\configurator\ConfiguratorPage.jsx",
  "src\pages\configurator\ConfiguratorPage.css",

  # ── Pages — home ─────────────────────────────────────────────
  "src\pages\home\HomePage.jsx",
  "src\pages\home\HomePage.css",

  # ── Pages — info ─────────────────────────────────────────────
  "src\pages\info\AboutPage.jsx",
  "src\pages\info\AboutPage.css",
  "src\pages\info\CollectionsPage.jsx",
  "src\pages\info\ContactPage.jsx",
  "src\pages\info\FaqPage.jsx",
  "src\pages\info\GiftingPage.jsx",
  "src\pages\info\GiftingPage.css",
  "src\pages\info\GiftRegistryPage.jsx",
  "src\pages\info\SizeGuidePage.jsx",
  "src\pages\info\PrivacyPolicyPage.jsx",
  "src\pages\info\TermsPage.jsx",
  "src\pages\info\NotFoundPage.jsx",
  "src\pages\info\NotFoundPage.css",
  "src\pages\info\ErrorPage.jsx",
  "src\pages\info\InfoPage.css",

  # ── Pages — product ──────────────────────────────────────────
  "src\pages\product\ProductDetailPage.jsx",
  "src\pages\product\ProductDetailPage.css",

  # ── Pages — quiz ─────────────────────────────────────────────
  "src\pages\quiz\WatchQuizPage.jsx",
  "src\pages\quiz\WatchQuizPage.css",

  # ── Pages — shop ─────────────────────────────────────────────
  "src\pages\shop\ShopPage.jsx",
  "src\pages\shop\ShopPage.css",
  "src\pages\shop\ShopMenPage.jsx",
  "src\pages\shop\ShopWomenPage.jsx",

  # ── Routes ───────────────────────────────────────────────────
  "src\routes\index.jsx",
  "src\routes\PrivateRoute.jsx",
  "src\routes\AdminRoute.jsx",
  "src\routes\ScrollToTop.jsx",

  # ── Services ─────────────────────────────────────────────────
  "src\services\watchService.js",
  "src\services\authService.js",
  "src\services\orderService.js",

  # ── Styles ───────────────────────────────────────────────────
  "src\styles\variables.css",
  "src\styles\index.css",
  "src\styles\animations.css",

  # ── Utils ────────────────────────────────────────────────────
  "src\utils\constants.js",
  "src\utils\formatters.js",
  "src\utils\validators.js",
  "src\utils\cn.js"
)

# ── Create all folders ───────────────────────────────────────
Write-Host "`n Creating folders..." -ForegroundColor Cyan
foreach ($folder in $folders) {
  New-Item -ItemType Directory -Path $folder -Force | Out-Null
  Write-Host "  [DIR]  $folder" -ForegroundColor Blue
}

# ── Create all files ─────────────────────────────────────────
Write-Host "`n Creating files..." -ForegroundColor Cyan
foreach ($file in $files) {
  if (-Not (Test-Path $file)) {
    New-Item -ItemType File -Path $file -Force | Out-Null
    Write-Host "  [NEW]  $file" -ForegroundColor Green
  } else {
    Write-Host "  [SKIP] $file (already exists)" -ForegroundColor Yellow
  }
}

# ── Summary ──────────────────────────────────────────────────
Write-Host "`n Done!" -ForegroundColor Green
Write-Host " $($folders.Count) folders created" -ForegroundColor Cyan
Write-Host " $($files.Count) files created" -ForegroundColor Cyan
Write-Host "`n Next steps:" -ForegroundColor White
Write-Host "  1. Delete App.jsx, App.css if they exist (replaced by Layout.jsx)" -ForegroundColor Yellow
Write-Host "  2. Delete tailwind.config.js if it exists" -ForegroundColor Yellow
Write-Host "  3. Run: npm install react-router-dom axios framer-motion react-hook-form yup react-hot-toast react-icons" -ForegroundColor Yellow
Write-Host "  4. Start with main.jsx then routes/index.jsx`n" -ForegroundColor Yellow
