import { prisma } from '../../lib/prisma'

export default async function AdminPage() {
  const pendingBoats = await prisma.boat.findMany({ where: { status: 'pending' } })
  const users = await prisma.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
  const bookings = await prisma.booking.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { boat: true, user: true } })
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin</h1>
      <div className="card p-4">
        <div className="font-semibold mb-2">Recent bookings</div>
        <ul className="text-sm">
          {bookings.map(b => <li key={b.id}>{b.createdAt.toDateString()} • {b.boat.title} • {b.user.email} • {b.status} • ৳{b.total.toLocaleString()}</li>)}
        </ul>
      </div>
      <div className="card p-4">
        <div className="font-semibold mb-2">Recent users</div>
        <ul className="text-sm">
          {users.map(u => <li key={u.id}>{u.email} • {u.role}</li>)}
        </ul>
      </div>
      <div className="card p-4">
        <div className="font-semibold">Pending boats: {pendingBoats.length}</div>
      </div>
    </div>
  )
}
