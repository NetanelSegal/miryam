import { motion } from 'motion/react'
import { Cake } from 'lucide-react'
import { Heading, Text, Countdown } from '@/components/ui'
import { birthdayTarget } from './constants'

export function BirthdaySection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
        <Cake className="w-16 h-16 md:w-20 md:h-20 text-accent-purple mx-auto mb-6" />
        <Heading level={1} gradient className="mb-4">יום הולדת שמח מרים!</Heading>
        <Text variant="secondary" size="xl" className="mb-10 md:mb-14">החגיגה בעיצומה</Text>
        <Countdown targetDate={birthdayTarget} className="justify-center" />
      </motion.div>
    </div>
  )
}
