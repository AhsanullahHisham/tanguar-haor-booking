import Link from 'next/link'
import { t } from '../lib/i18n'
import { prisma } from '../lib/prisma'
import Image from 'next/image'

export default async function Home() {
  const boats = await prisma.boat.findMany({
    where: { status: 'active' },
    include: { photos: true },
    take: 6,
  })
  return (
    <div className="space-y-8">
      <section className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">{t('appName')}</h1>
        <p className="text-gray-600">Redbus-স্টাইল বুকিং: তারিখ বাছাই করুন, বোট তুলনা করুন, বুক ও পেমেন্ট করুন।</p>
        <div className="mt-4">
          <Link href="/search" className="btn">{t('findBoats')}</Link>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-3">{t('featuredBoats')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boats.map(b => (
            <Link key={b.id} href={`/boats/${b.slug}`} className="card overflow-hidden hover:shadow-md transition">
              {b.photos[0] && (
                <Image src={b.photos[0].url} width={800} height={500} alt={b.title} className="h-48 w-full object-cover"/>
              )}
              <div className="p-4">
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-gray-600">Cap: {b.capacity} • {t('pickupGhat')}: {b.pickupGhat}</div>
                <div className="mt-2 text-brand-700 font-semibold">{t('priceFrom')} ৳{b.basePrice.toLocaleString()} {t('perNight')}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
