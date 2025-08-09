import Link from 'next/link'
import { prisma } from '../../lib/prisma'

export default async function Success({ searchParams }: any) {
  const id = searchParams.id as string
  const booking = await prisma.booking.findUnique({ where: { id }, include: { boat: true, user: true } })
  if (!booking) return <div className="card p-4">Not found</div>
  const wa = `https://wa.me/8801887565555?text=${encodeURIComponent('Booking '+booking.id+' placed. Please share payment details.')}`
  const inv = `/api/invoice/${booking.id}`
  return (
    <div className="max-w-lg mx-auto card p-6 space-y-3">
      <h1 className="text-xl font-semibold">Booking placed</h1>
      <div className="text-sm text-gray-700">Status: {booking.status} • Hold expires: {booking.holdExpiresAt?.toLocaleTimeString()}</div>
      <div className="text-sm">Boat: {booking.boat.title}</div>
      <div className="text-sm">Dates: {booking.startDate.toDateString()} → {booking.endDate.toDateString()}</div>
      <div className="text-sm font-semibold">Total: ৳{booking.total.toLocaleString()}</div>
      <div className="flex gap-2">
        <a className="btn" href={wa} target="_blank">WhatsApp</a>
        <a className="btn-outline" href={inv} target="_blank">Download invoice (PDF)</a>
      </div>
      <Link className="btn-outline" href="/">Back to home</Link>
    </div>
  )
}
