import { prisma } from '../../lib/prisma'
import { redirect } from 'next/navigation'
import { getSession } from '../../lib/session'
import Link from 'next/link'

function nights(start: Date, end: Date) {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000*60*60*24)))
}

export default async function Checkout({ searchParams }: any) {
  const session = await getSession()
  if (!session) redirect('/login')

  const boatId = searchParams.boat as string
  const start = new Date(searchParams.start)
  const end = new Date(searchParams.end)
  const guests = Number(searchParams.guests || 1)

  const boat = await prisma.boat.findUnique({ where: { id: boatId }, include: { addOns: true } })
  if (!boat) redirect('/search')

  const n = nights(start, end)
  const subtotal = boat.type === 'whole' ? boat.basePrice * n : boat.basePrice * guests * n
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-4">
          <h1 className="text-xl font-semibold">Checkout</h1>
          <form method="post" action="/api/bookings" className="space-y-3">
            <input type="hidden" name="boatId" value={boat.id} />
            <input type="hidden" name="start" value={start.toISOString()} />
            <input type="hidden" name="end" value={end.toISOString()} />
            <input type="hidden" name="guests" value={guests} />
            <input type="hidden" name="subtotal" value={subtotal} />
            <input type="hidden" name="serviceFee" value={serviceFee} />
            <input type="hidden" name="total" value={total} />
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input name="fullName" required className="w-full rounded-xl border p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input name="phone" required className="w-full rounded-xl border p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Payment</label>
              <select name="paymentMethod" className="w-full rounded-xl border p-2">
                <option value="manual">Manual bank transfer (30 min hold)</option>
              </select>
            </div>
            <button type="submit" className="btn">Place booking</button>
          </form>
        </div>
      </div>
      <div className="space-y-4">
        <div className="card p-4">
          <div className="font-semibold">{boat.title}</div>
          <div className="text-sm text-gray-600">{start.toDateString()} → {end.toDateString()} • {guests} guests</div>
          <div className="mt-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Service fee</span><span>৳{serviceFee.toLocaleString()}</span></div>
            <div className="flex justify-between font-semibold mt-2"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">After placing, you will get a 30-minute payment window. Unpaid holds auto-cancel.</div>
        </div>
        <div className="card p-4">
          <div className="text-sm">Need help? <a className="underline" target="_blank" href={"https://wa.me/8801887565555?text="+encodeURIComponent('Help with checkout')}>WhatsApp</a></div>
        </div>
      </div>
    </div>
  )
}
