import bn from '../locales/bn.json'
import en from '../locales/en.json'
import { cookies } from 'next/headers'

export type LocaleKey = keyof typeof bn

export function getLocale() {
  const c = cookies().get('lang')?.value
  return c === 'en' ? 'en' : 'bn'
}

export function t(key: LocaleKey): string {
  const lang = getLocale()
  const dict = lang === 'en' ? en : bn
  return (dict as any)[key] || key
}
