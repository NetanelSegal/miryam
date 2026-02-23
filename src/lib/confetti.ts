interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  life: number
}

const COLORS = ['#6366f1', '#a855f7', '#818cf8', '#c084fc', '#fafafa', '#e879f9']

export function confetti(options: { x?: number; y?: number; count?: number } = {}) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const { x = window.innerWidth / 2, y = window.innerHeight / 2, count = 80 } = options

  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')!
  const particles: Particle[] = []

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const velocity = 4 + Math.random() * 8
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      life: 1,
    })
  }

  let animFrame: number

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.15
      p.vx *= 0.99
      p.rotation += p.rotationSpeed
      p.life -= 0.012

      if (p.life <= 0) continue
      alive = true

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    }

    if (alive) {
      animFrame = requestAnimationFrame(animate)
    } else {
      canvas.remove()
    }
  }

  animFrame = requestAnimationFrame(animate)

  setTimeout(() => {
    cancelAnimationFrame(animFrame)
    canvas.remove()
  }, 4000)
}
