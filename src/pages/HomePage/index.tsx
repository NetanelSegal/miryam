import {
  Heading, Text, Button, Container, Countdown,
} from '@/components/ui'
import { AnimateOnScroll } from '@/components/motion'
import { useParallax } from '@/hooks'
import { LINKS } from '@/config/links'
import { BIRTHDAY } from './constants'
import { StatSection } from './StatSection'
import { BrandMarqueeSection } from './BrandMarqueeSection'
import { CaseStudiesSection } from './CaseStudiesSection'
import { TiktokTopVideosSection } from './TiktokTopVideosSection'
import { ContactForm } from './ContactForm'

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
              alt="מרים סגל "
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

        {/* --- TikTok top videos --- */}
        <TiktokTopVideosSection />

        {/* --- Brand Logos --- */}
        <section className="py-12 border-t border-b border-white/5 overflow-x-hidden">
          <Container size="lg" className="overflow-hidden">
            <AnimateOnScroll variant="fade">
              <Text variant="label" className="text-center mb-8">עבדתי עם</Text>
              <BrandMarqueeSection />
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

            <CaseStudiesSection />
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
                <Text variant="secondary" className="leading-relaxed">
                  מתמחה ביצירת קמפיינים ויראליים בטיקטוק ואינסטגרם, עם דגש על אותנטיות ותוצאות
                  מדידות. שיתפה פעולה עם מותגים מובילים כמו L'Oréal, Samsung, Fox ועוד.
                </Text>
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
                <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors text-sm">
                  Instagram
                </a>
                <a href={LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors text-sm">
                  TikTok
                </a>
                <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors text-sm">
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
