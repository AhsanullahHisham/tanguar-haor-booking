import { prisma } from '../../lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { t } from '../../lib/i18n'

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && bStart <= aEnd
}

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const start = searchParams.start ? new Date(searchParams.start) : null
  const end = searchParams.end ? new Date(searchParams.end) : null
  const guests = searchParams.guests ? Number(searchParams.guests) : null

  let boats = await prisma.boat.findMany({
    where: { status: 'active' },
    include: { photos: true, blocks: true, bookings: true },
  })

  if (guests) boats = boats.filter(b => b.capacity >= guests)
  if (start && end) {
    boats = boats.filter(b => {
      const blocked = b.blocks.some(blk => overlaps(start, end, blk.startDate, blk.endDate))
      if (blocked) return false
      const now = new Date()
      const activeBookings = b.bookings.filter(
        (bb) =>
          (bb.status === 'paid' || bb.status === 'held') &&
          (bb.holdExpiresAt == null || bb.holdExpiresAt > now)
      )
      const booked = activeBookings.some(bb => overlaps(start, end, bb.startDate, bb.endDate))
      return !booked
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t('searchResults')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boats.map(b => (
          <div key={b.id} className="card overflow-hidden">
            {b.photos[0] && <Image src={b.photos[0].url} alt={b.title} width={800} height={500} className="h-48 w-full object-cover"/>}
            <div className="p-4">
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-600">Cap: {b.capacity} • {t('pickupGhat')}: {b.pickupGhat}</div>
              <div className="mt-2 text-brand-700 font-semibold">{t('priceFrom')} ৳{b.basePrice.toLocaleString()} {t('perNight')}</div>
              <div className="mt-3 flex gap-2">
                <Link className="btn-outline" href={`/boats/${b.slug}${start && end ? `?start=${start.toISOString()}&end=${end.toISOString()}`:''}`}>{t('viewDetails')}</Link>
                <Link className="btn" href={`/boats/${b.slug}${start && end ? `?start=${start.toISOString()}&end=${end.toISOString()}`:''}`}>{t('bookNow')}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {boats.length === 0 && <div className="text-gray-600">No boats available. Try different dates.</div>}
    </div>
  )
}
