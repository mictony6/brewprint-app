function Button({ variant = 'primary', labelClassName, children, className, onClick, ...props }: ButtonProps) {
  
  function handleDroplet(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const originX = e.clientX - rect.left
    const originY = e.clientY - rect.top
    const distX = Math.max(originX, rect.width - originX)
    const distY = Math.max(originY, rect.height - originY)
    const size = Math.sqrt(distX * distX + distY * distY) * 2
    const droplet = document.createElement('span')
    droplet.className = 'droplet'
    droplet.style.width = droplet.style.height = `${size}px`
    droplet.style.left = `${originX - size / 2}px`
    droplet.style.top = `${originY - size / 2}px`
    button.appendChild(droplet)
    droplet.addEventListener('animationend', () => droplet.remove())
  }
  
  return (
    <button
    className={`btn-${variant} ${className ?? ''}`.trim()}
    type="button"
    onClick={(e) => {
      handleDroplet(e)
      setTimeout(() => onClick?.(e), 200)
    }}
    {...props}
    >
      <span className={labelClassName}>{children}</span>
      <span id="leather-texture"></span>

    </button>
  )
}


type ButtonProps = {
  variant?: 'primary' | 'secondary'
  labelClassName?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default Button