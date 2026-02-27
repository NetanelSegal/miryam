import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

interface BaseInputProps {
  label?: string
  error?: string
  helperText?: string
}

type InputFieldProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false }
type TextareaFieldProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true }
type InputProps = InputFieldProps | TextareaFieldProps

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input({ label, error, helperText, className = '', ...props }, ref) {
    const baseClasses = `w-full bg-white/5 border-2 ${error ? 'border-red-500/60' : 'border-border-neutral'} rounded-none px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo transition-colors duration-[180ms] font-[var(--font-family-body)]`
    const id = props.id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)
    const isMultiline = 'multiline' in props && props.multiline
    const { multiline: _multiline, ...restProps } = props as TextareaFieldProps & { multiline?: boolean }

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={id} className="text-text-secondary text-sm font-medium">
            {label}
          </label>
        )}
        {isMultiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            className={`${baseClasses} min-h-[120px] resize-y`}
            {...(restProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
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
)
