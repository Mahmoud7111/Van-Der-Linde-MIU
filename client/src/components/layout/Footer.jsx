/**
 * STUB COMPONENT: Footer
 *
 * What this file is:
 * A temporary minimal footer scaffold for the Van Der Linde layout.
 *
 * What it does:
 * Renders a basic branded footer area and copyright text so layout is complete
 * while the full footer feature work is in progress.
 *
 * Where it is used:
 * Imported and rendered in Layout.jsx on every route.
 *
 * NOTE:
 * Full footer implementation (multi-column links, social icons, newsletter form,
 * responsive behavior, and final styling) is owned by Dev 5.
 */

// Stub footer component used until the production footer is delivered by Dev 5.
export default function Footer() {
  return (
    <footer className="footer">
      {/* Brand signature line anchors the footer visually for now. */}
      <p>Van Der Linde - Crafted Time, Refined Legacy.</p>

      {/* Basic legal line keeps the page production-safe until full footer lands. */}
      <small>&copy; {new Date().getFullYear()} Van Der Linde. All rights reserved.</small>
    </footer>
  )
}
