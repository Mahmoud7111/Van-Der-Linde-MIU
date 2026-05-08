import './LoadingScreen.css'

export default function LoadingScreen({ isVisible = true }) {
  if (!isVisible) return null

  return (
    <div className="loading-screen" aria-hidden="true">
      <div className="loading-screen__content" aria-hidden="true">
        <div className="loading-screen__watch">
          <div className="loading-screen__glow" />
          <div className="loading-screen__face" />
          <div className="loading-screen__hand loading-screen__hand--hour" />
          <div className="loading-screen__hand loading-screen__hand--minute" />
          <div className="loading-screen__pivot" />
        </div>
        <div className="loading-screen__brand">
          <img className="loading-screen__logo" src="/Logo2.png" alt="" />
        </div>
      </div>
    </div>
  )
}
