import { prisma } from '../../../lib/prisma'
import { getSession } from '../../../lib/session'
import { redirect } from 'next/navigation'

function fmt(d: Date) { return d.toISOString().slice(0,10) }

export default async function BlocksPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  const boats = await prisma.boat.findMany({ where: { ownerId: session.userId }, include: { blocks: true } })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Block Dates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boats.map(b => (
          <div key={b.id} className="card p-4">
            <div className="font-semibold mb-2">{b.title}</div>
            <form action="/api/blocks" method="post" className="space-y-2">
              <input type="hidden" name="boatId" value={b.id} />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-sm">Start</label><input name="start" type="date" className="w-full rounded-xl border p-2"/></div>
                <div><label className="block text-sm">End</label><input name="end" type="date" className="w-full rounded-xl border p-2"/></div>
              </div>
              <div><label className="block text-sm">Reason</label><input name="note" className="w-full rounded-xl border p-2"/></div>
              <button className="btn">Block</button>
            </form>
            <div className="text-sm text-gray-600 mt-3">Current blocks: {b.blocks.length ? b.blocks.map(x => `${fmt(x.startDate)}–${fmt(x.endDate)}`).join(', '): 'None'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
