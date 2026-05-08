import { motion as Motion } from 'framer-motion'

//* This component is a placeholder for the page transition effect. It uses Framer Motion to animate page content on mount and unmount. You can customize the animation as needed. To apply page transitions, wrap the Outlet in Layout.jsx with this component.

export default function PageTransition({ children }) {
  return (
    <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </Motion.div>
  )
}

// This component can be used to wrap page content in routes that require a transition effect.
// It uses Framer Motion to animate opacity and vertical position on mount and unmount.
// To apply page transitions, simply wrap the Outlet in Layout.jsx with <PageTransition>.

//! It is Not Finished Yet, but the basic structure is there. You can see it in action on the homepage hero section for now. The idea is to wrap the Outlet in Layout.jsx with this component so that all page transitions get this fade/slide effect.