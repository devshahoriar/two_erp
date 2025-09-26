/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateError(error: any): string {
  if (!error.success) {
    const firstError = error.error.errors[0].message
    return firstError
  }
  return ''
}

