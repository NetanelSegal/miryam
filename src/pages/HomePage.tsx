import { useState, useRef, type FormEvent } from 'react'
import {
  Heading, Text, Button, Container, Countdown,
  StatCard, Marquee, Card, Input,
} from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { AnimateOnScroll, StaggerChildren } from '@/components/motion'
import { useCountUp, useParallax } from '@/hooks'
import { useInView } from 'motion/react'
import * as store from '@/lib/store'

const BIRTHDAY = new Date('2026-03-05T00:00:00')

const socialStats = [
  { value: 580, suffix: 'K+', label: 'עוקבים באינסטגרם' },
  { value: 620, suffix: 'K+', label: 'עוקבים בטיקטוק' },
  { value: 45, suffix: 'K+', label: 'מנויים ביוטיוב' },
  { value: 8.2, suffix: '%', label: 'אחוז מעורבות', decimals: 1 },
]

const brands = ["L'Oréal", 'MAC', 'Samsung', 'Fox', 'Castro', 'Adidas', 'Zara', 'H&M']

const caseStudies = [
  {
    brand: "L'Oréal",
    title: 'קמפיין True Match',
    description: 'סדרת תוכן שהגיעה ל-2.7 מיליון צפיות עם אחוז מעורבות של 12%',
    metric: '2.7M צפיות',
    image: '/images/WhatsApp Image 2026-02-23 at 10.39.53.jpeg',
  },
  {
    brand: 'Samsung',
    title: 'השקת Galaxy S26',
    description: 'שיתוף פעולה ל-Unboxing ו-Review שהפך לוויראלי',
    metric: '1.2M צפיות',
    image: '/images/WhatsApp Image 2026-02-23 at 10.39.48.jpeg',
  },
  {
    brand: 'Fox',
    title: 'קולקציית קיץ',
    description: 'קמפיין אופנה עם 5 סרטוני TikTok שהניבו המרות ישירות',
    metric: '890K צפיות',
    image: '/images/WhatsApp Image 2026-02-23 at 10.39.56.jpeg',
  },
]

/* ------------------------------------------------------------------ */
/*  Stat sub-section with count-up animation                          */
/* ------------------------------------------------------------------ */

function StatSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref}>
      <StaggerChildren staggerDelay={0.12} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {socialStats.map((stat) => (
          <StatItem key={stat.label} stat={stat} enabled={isInView} />
        ))}
      </StaggerChildren>
    </div>
  )
}

function StatItem({ stat, enabled }: { stat: (typeof socialStats)[number]; enabled: boolean }) {
  const count = useCountUp({
    end: stat.value,
    duration: 2000,
    decimals: stat.decimals ?? 0,
    enabled,
  })

  return <StatCard value={`${count}${stat.suffix}`} label={stat.label} />
}

/* ------------------------------------------------------------------ */
/*  B2B Contact form                                                  */
/* ------------------------------------------------------------------ */

function ContactForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  })

  const set = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    store.saveContact(formData)
    toast('success', 'ההודעה נשלחה בהצלחה!')
    setFormData({ name: '', company: '', email: '', message: '' })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="שם" value={formData.name} onChange={set('name')} required placeholder="השם שלך" />
        <Input label="חברה" value={formData.company} onChange={set('company')} placeholder="שם החברה" />
      </div>
      <Input
        label="אימייל"
        type="email"
        value={formData.email}
        onChange={set('email')}
        required
        placeholder="your@email.com"
        dir="ltr"
      />
      <Input
        label="הודעה"
        multiline
        value={formData.message}
        onChange={set('message')}
        required
        placeholder="ספרו לנו על הפרויקט..."
      />
      <Button variant="primary" size="lg" type="submit" loading={loading} className="w-full">
        שליחה
      </Button>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  HomePage                                                          */
/* ------------------------------------------------------------------ */

export function HomePage() {
  const { ref: parallaxRef, style: parallaxStyle } = useParallax(0.15)

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
        {/* Background image with parallax */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div ref={parallaxRef} style={parallaxStyle} className="absolute -inset-20">
            <img
              src="/images/WhatsApp Image 2026-02-23 at 10.39.43.jpeg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent" />
        </div>

        {/* Decorative sparkles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" aria-hidden="true">
          <circle cx="15%" cy="20%" r="2" fill="white" opacity="0.15" className="animate-pulse" />
          <circle cx="80%" cy="15%" r="1.5" fill="white" opacity="0.12" className="animate-pulse [animation-delay:1.2s]" />
          <circle cx="70%" cy="70%" r="2.5" fill="white" opacity="0.1" className="animate-pulse [animation-delay:0.6s]" />
          <circle cx="25%" cy="75%" r="1.8" fill="white" opacity="0.13" className="animate-pulse [animation-delay:1.8s]" />
          <circle cx="50%" cy="30%" r="1.2" fill="white" opacity="0.1" className="animate-pulse [animation-delay:2.4s]" />
          <polygon points="90,50 93,58 100,58 94,63 96,71 90,66 84,71 86,63 80,58 87,58" fill="white" opacity="0.06" className="animate-pulse [animation-delay:0.8s]" />
          <polygon points="200,120 202,126 208,126 203,130 205,136 200,132 195,136 197,130 192,126 198,126" fill="white" opacity="0.05" className="animate-pulse [animation-delay:2s]" />
        </svg>

        <AnimateOnScroll variant="fade" duration={0.8}>
          <Heading level={1} gradient className="mb-4">
            מרים סגל
          </Heading>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.2}>
          <Text variant="secondary" size="xl" className="mb-8 max-w-md text-zinc-300">
            יוצרת תוכן · לייפסטייל · משפחה
          </Text>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.4}>
          <Countdown targetDate={BIRTHDAY} className="mb-10" />
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.6}>
          <Button variant="cta" size="lg" href="/party">
            היכנסו למסיבה
          </Button>
        </AnimateOnScroll>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* ========== MEDIA KIT ========== */}
      <div className="relative">
        {/* --- Social Stats --- */}
        <section className="py-20 md:py-28">
          <Container size="lg">
            <AnimateOnScroll variant="fade-up">
              <Text variant="label" className="text-center mb-3">Media Kit</Text>
              <Heading level={2} gradient className="text-center mb-4">
                הנתונים מדברים
              </Heading>
              <Text variant="secondary" className="text-center mb-12 max-w-md mx-auto">
                נתוני קהל עדכניים מכל הפלטפורמות
              </Text>
            </AnimateOnScroll>
            <StatSection />
          </Container>
        </section>

        {/* --- Brand Logos --- */}
        <section className="py-12 border-t border-b border-white/5">
          <Container size="lg">
            <AnimateOnScroll variant="fade">
              <Text variant="label" className="text-center mb-8">עבדתי עם</Text>
              <Marquee speed={25}>
                {brands.map((brand) => (
                  <div
                    key={brand}
                    className="shrink-0 w-28 h-12 bg-white/5 flex items-center justify-center text-text-muted text-sm font-medium"
                  >
                    {brand}
                  </div>
                ))}
              </Marquee>
            </AnimateOnScroll>
          </Container>
        </section>

        {/* --- Case Studies --- */}
        <section className="py-20 md:py-28">
          <Container size="lg">
            <AnimateOnScroll variant="fade-up">
              <Text variant="label" className="text-center mb-3">קמפיינים</Text>
              <Heading level={2} gradient className="text-center mb-12">
                שיתופי פעולה בולטים
              </Heading>
            </AnimateOnScroll>

            <StaggerChildren staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <Card key={study.brand} variant="accent" className="overflow-hidden">
                  <div className="aspect-4/3 overflow-hidden relative">
                    <img src={study.image} alt={study.brand} className="w-full h-full object-cover" />
                    <div className="img-overlay" />
                    <span className="absolute bottom-3 right-3 z-10 bg-accent-indigo/80 px-3 py-1 text-xs font-medium text-white">
                      {study.metric}
                    </span>
                  </div>
                  <div className="p-5">
                    <Text variant="muted" size="xs" className="mb-1 uppercase tracking-wider">
                      {study.brand}
                    </Text>
                    <Heading level={5} className="mb-2">{study.title}</Heading>
                    <Text variant="secondary" size="sm">{study.description}</Text>
                  </div>
                </Card>
              ))}
            </StaggerChildren>
          </Container>
        </section>

        {/* --- About --- */}
        <section className="py-20 md:py-28 border-t border-white/5">
          <Container size="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <AnimateOnScroll variant="fade-right">
                <div className="card-accent overflow-hidden">
                  <img
                    src="/images/WhatsApp Image 2026-02-23 at 10.39.51.jpeg"
                    alt="מרים סגל"
                    className="w-full aspect-3/4 object-cover"
                  />
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fade-left" delay={0.2}>
                <Text variant="label" className="mb-3">קצת עליי</Text>
                <Heading level={2} gradient className="mb-6">
                  מרים סגל
                </Heading>
                <Text variant="secondary" size="lg" className="mb-6 leading-relaxed">
                  יוצרת תוכן דיגיטלי בתחום הלייפסטייל, היופי וחיי המשפחה. עם קהילה של מעל מיליון
                  עוקבים, מרים יוצרת תוכן אותנטי שמחבר בין מותגים לקהלים צעירים בישראל.
                </Text>
                <Text variant="secondary" className="mb-8 leading-relaxed">
                  מתמחה ביצירת קמפיינים ויראליים בטיקטוק ואינסטגרם, עם דגש על אותנטיות ותוצאות
                  מדידות. שיתפה פעולה עם מותגים מובילים כמו L'Oréal, Samsung, Fox ועוד.
                </Text>
                <Button variant="secondary" href="/party">
                  הכירו את מרים
                </Button>
              </AnimateOnScroll>
            </div>
          </Container>
        </section>

        {/* --- Contact Form --- */}
        <section className="py-20 md:py-28 border-t border-white/5">
          <Container size="md">
            <AnimateOnScroll variant="fade-up">
              <Text variant="label" className="text-center mb-3">יצירת קשר</Text>
              <Heading level={2} gradient className="text-center mb-4">
                בואו נעבוד ביחד
              </Heading>
              <Text variant="secondary" className="text-center mb-12 max-w-md mx-auto">
                מעוניינים בשיתוף פעולה? מלאו את הטופס ונחזור אליכם בהקדם
              </Text>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fade-up" delay={0.2}>
              <ContactForm />
            </AnimateOnScroll>
          </Container>
        </section>

        {/* --- Footer --- */}
        <footer className="py-8 border-t border-white/5">
          <Container size="lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Text variant="muted" size="sm">© 2026 מרים סגל. כל הזכויות שמורות.</Text>
              <div className="flex gap-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors text-sm">
                  Instagram
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors text-sm">
                  TikTok
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors text-sm">
                  YouTube
                </a>
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </div>
  )
}
