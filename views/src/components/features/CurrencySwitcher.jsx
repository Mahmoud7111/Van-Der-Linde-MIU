import { useCurrency } from '@/context/CurrencyContext'
import { CURRENCIES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import './CurrencySwitcher.css'

export default function CurrencySwitcher({ className, showLabel = false }) {
  const { currency, setCurrency } = useCurrency()

  const currentIndex = CURRENCIES.findIndex((c) => c.code === currency)
  const currentCurrency = CURRENCIES[currentIndex !== -1 ? currentIndex : 0]

  const handleToggle = () => {
    const nextIndex = (currentIndex + 1) % CURRENCIES.length
    setCurrency(CURRENCIES[nextIndex].code)
  }

  return (
    <button 
      type="button" 
      className={cn('currency-switcher', className)} 
      onClick={handleToggle}
      aria-label={`Current currency is ${currentCurrency.label}. Click to change.`}
    >
      <span className="currency-switcher__icon-wrapper" aria-hidden="true">
        {currentCurrency.symbol}
      </span>
      {showLabel && <span className="currency-switcher__label"> {currentCurrency.code}</span>}
    </button>
  )
}
