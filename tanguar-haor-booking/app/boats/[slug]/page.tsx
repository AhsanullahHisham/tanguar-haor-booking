import { prisma } from '../../../lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { t } from '../../../lib/i18n'
import Link from 'next/link'

function fmt(d: Date) { return d.toISOString().slice(0,10) }

export default async function BoatPage({ params, searchParams }: any) {
  const boat = await prisma.boat.findUnique({ where: { slug: params.slug }, include: { photos: true, addOns: true, blocks: true, bookings: true } })
  if (!boat) return notFound()

  const start = searchParams.start ? new Date(searchParams.start) : null
  const end = searchParams.end ? new Date(searchParams.end) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="card overflow-hidden">
          <div className="grid grid-cols-3 gap-1">
            {boat.photos.slice(0,3).map(p => (
              <Image key={p.id} src={p.url} alt={boat.title} width={1200} height={800} className="h-48 w-full object-cover"/>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <h1 className="text-2xl font-semibold">{boat.title}</h1>
          <div className="text-gray-600">Cap: {boat.capacity} • {t('pickupGhat')}: {boat.pickupGhat}</div>
          <p className="mt-2">{boat.description}</p>
          <div className="mt-3">
            <div className="font-semibold mb-2">{t('addOns')}</div>
            <ul className="list-disc pl-5">
              {boat.addOns.map(a => <li key={a.id}>{a.name} — ৳{a.price.toLocaleString()}</li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="card p-4">
          <div className="text-gray-700">{t('priceFrom')} <span className="text-brand-700 font-semibold">৳{boat.basePrice.toLocaleString()}</span> {t('perNight')}</div>
          <form action="/checkout" method="get" className="mt-3 space-y-2">
            <input type="hidden" name="boat" value={boat.id} />
            <label className="block text-sm">Start</label>
            <input name="start" type="date" defaultValue={start ? fmt(start) : ''} className="w-full rounded-xl border p-2"/>
            <label className="block text-sm">End</label>
            <input name="end" type="date" defaultValue={end ? fmt(end) : ''} className="w-full rounded-xl border p-2"/>
            <label className="block text-sm">{t('guests')}</label>
            <input name="guests" type="number" min={1} defaultValue={4} className="w-full rounded-xl border p-2"/>
            <button className="btn w-full mt-2" type="submit">{t('bookNow')}</button>
          </form>
          <div className="text-xs text-gray-500 mt-2">WhatsApp: <a className="underline" href={"https://wa.me/8801887565555?text="+encodeURIComponent(`Hello, I want to book ${boat.title}.`)} target="_blank">Chat</a></div>
        </div>
        <div className="card p-4">
          <div className="font-semibold mb-2">{t('availability')}</div>
          <div className="text-sm text-gray-600">Blocked dates: {boat.blocks.length ? boat.blocks.map(b => `${fmt(b.startDate)}–${fmt(b.endDate)}`).join(', ') : 'None'}</div>
        </div>
      </div>
    </div>
  )
}
