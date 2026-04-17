export default function Modal({ children, isOpen }) {
  if (!isOpen) return null
  return <div>{children}</div>
}