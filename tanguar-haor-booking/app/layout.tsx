import './globals.css'
import Link from 'next/link'
import { t } from '../lib/i18n'
import { cookies } from 'next/headers'
import { getSession } from '../lib/session'

export const metadata = {
  title: t('appName'),
  description: 'Redbus-style booking for Tanguar Haor houseboats',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const lang = cookies().get('lang')?.value || 'bn'
  return (
    <html lang={lang}>
      <body className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="text-xl font-semibold">{t('appName')}</Link>
            <nav className="flex gap-3 items-center">
              <Link className="btn-outline" href="/search">{t('search')}</Link>
              {session?.role === 'owner' && <Link className="btn-outline" href="/owner">{t('ownerDashboard')}</Link>}
              {session?.role === 'admin' && <Link className="btn-outline" href="/admin">{t('adminPanel')}</Link>}
              {session ? (
                <form action="/api/logout" method="post"><button className="btn-outline">{t('logout')}</button></form>
              ) : (
                <Link className="btn" href="/login">{t('login')}</Link>
              )}
              <form action="/api/lang" method="post">
                <input type="hidden" name="lang" value={lang === 'bn' ? 'en' : 'bn'} />
                <button className="btn-outline" type="submit">{lang === 'bn' ? 'EN' : 'BN'}</button>
              </form>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  )
}
