import { prisma } from '../../lib/prisma'
import { getSession } from '../../lib/session'
import Link from 'next/link'

export default async function OwnerHome() {
  const session = await getSession()
  const owner = await prisma.user.findUnique({ where: { id: session!.userId }, include: { ownerProfile: true } })
  const boats = await prisma.boat.findMany({ where: { ownerId: session!.userId }, include: { bookings: true } })
  const upcoming = await prisma.booking.findMany({ where: { boat: { ownerId: session!.userId }, startDate: { gt: new Date() } }, orderBy: { startDate: 'asc' }, take: 5, include: { boat: true } })
  const mtd = await prisma.booking.aggregate({ _sum: { total: true }, where: { boat: { ownerId: session!.userId }, status: 'paid' } })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4"><div className="text-sm text-gray-500">Revenue (paid)</div><div className="text-2xl font-semibold">৳{(mtd._sum.total||0).toLocaleString()}</div></div>
        <div className="card p-4"><div className="text-sm text-gray-500">Boats</div><div className="text-2xl font-semibold">{boats.length}</div></div>
        <div className="card p-4"><div className="text-sm text-gray-500">Upcoming</div><div className="text-2xl font-semibold">{upcoming.length}</div></div>
      </div>
      <div className="card p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Your Boats</h2>
          <Link className="btn-outline" href="/owner/blocks">Manage Blocks</Link>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {boats.map(b => (
            <div key={b.id} className="border rounded-xl p-3">
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-600">Bookings: {b.bookings.length}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-4">
        <h2 className="font-semibold mb-2">Upcoming</h2>
        <ul className="text-sm">
          {upcoming.map(u => <li key={u.id}>{u.startDate.toDateString()} – {u.endDate.toDateString()} • {u.boat.title} • ৳{u.total.toLocaleString()}</li>)}
        </ul>
      </div>
    </div>
  )
}
