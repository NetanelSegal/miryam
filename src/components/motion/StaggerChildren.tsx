import { type ReactNode, Children } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface StaggerChildrenProps {
  children: ReactNode
  staggerDelay?: number
  duration?: number
  className?: string
  once?: boolean
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className = '',
  once = true,
}: StaggerChildrenProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      custom={staggerDelay}
      variants={containerVariants}
      className={className}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
