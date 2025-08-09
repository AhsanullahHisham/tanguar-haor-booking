import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'
import { getSession } from '../../../lib/session'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const fd = await req.formData()
  const boatId = String(fd.get('boatId'))
  const start = new Date(String(fd.get('start')))
  const end = new Date(String(fd.get('end')))
  const guests = Number(fd.get('guests')||1)
  const subtotal = Number(fd.get('subtotal')||0)
  const serviceFee = Number(fd.get('serviceFee')||0)
  const total = Number(fd.get('total')||0)
  const paymentMethod = String(fd.get('paymentMethod')||'manual')

  // 30-min hold
  const holdExpiresAt = new Date(Date.now() + 30*60*1000)

  // availability check (simple)
  const blocks = await prisma.availabilityBlock.findMany({ where: { boatId, OR: [{ startDate: { lte: end }, endDate: { gte: start } }] } })
  if (blocks.length) return NextResponse.json({ error: 'Blocked' }, { status: 400 })
  const now = new Date()
  const bookings = await prisma.booking.findMany({ where: { boatId, status: { in: ['paid','held'] }, OR: [{ startDate: { lte: end }, endDate: { gte: start } }] } })
  const active = bookings.filter(b => b.status === 'paid' || (b.status === 'held' && b.holdExpiresAt && b.holdExpiresAt > now))
  if (active.length) return NextResponse.json({ error: 'Already booked' }, { status: 400 })

  const boat = await prisma.boat.findUnique({ where: { id: boatId } })
  if (!boat) return NextResponse.json({ error: 'Boat not found' }, { status: 404 })

  const booking = await prisma.booking.create({
    data: {
      boatId,
      userId: session.userId,
      type: boat.type,
      startDate: start,
      endDate: end,
      guests,
      subtotal,
      serviceFee,
      total,
      status: 'held',
      paymentMethod,
      holdExpiresAt,
    }
  })

  // Redirect to confirmation with invoice link & WhatsApp
  return NextResponse.redirect(new URL(`/success?id=${booking.id}`, process.env.NEXT_PUBLIC_BASE_URL))
}
