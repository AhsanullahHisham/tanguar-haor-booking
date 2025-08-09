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
  const note = String(fd.get('note') || '')
  await prisma.availabilityBlock.create({ data: { boatId, startDate: start, endDate: end, note, createdBy: session.userId } })
  return NextResponse.redirect(new URL('/owner/blocks', process.env.NEXT_PUBLIC_BASE_URL))
}
