import { type InputHTMLAttributes, type TextareaHTMLAttributes, type Ref } from 'react'

interface BaseInputProps {
  label?: string
  error?: string
  helperText?: string
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>
}

type InputFieldProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false }
type TextareaFieldProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true }
type InputProps = InputFieldProps | TextareaFieldProps

export function Input({ label, error, helperText, className = '', ref, ...props }: InputProps) {
  const baseClasses = `w-full bg-white/5 border-2 ${error ? 'border-red-500/60' : 'border-border-neutral'} rounded-none px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo transition-colors duration-[180ms] font-[var(--font-family-body)]`
  const id = props.id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)
  const { multiline, ...restProps } = props as TextareaFieldProps & { multiline?: boolean }
  const isMultiline = Boolean(multiline)

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-text-secondary text-sm font-medium">
          {label}
        </label>
      )}
      {isMultiline ? (
        <textarea
          ref={ref as Ref<HTMLTextAreaElement>}
          id={id}
          className={`${baseClasses} min-h-[120px] resize-y`}
          {...(restProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as Ref<HTMLInputElement>}
          id={id}
          className={baseClasses}
          {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className="text-red-400 text-xs">{error}</span>}
      {helperText && !error && <span className="text-text-muted text-xs">{helperText}</span>}
    </div>
  )
}
