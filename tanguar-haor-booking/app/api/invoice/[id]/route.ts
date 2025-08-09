import { prisma } from '../../../../lib/prisma'
import PDFDocument from 'pdfkit'

export async function GET(_: Request, { params }: any) {
  const id = params.id as string
  const booking = await prisma.booking.findUnique({ where: { id }, include: { boat: true, user: true } })
  if (!booking) return new Response('Not found', { status: 404 })
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const chunks: any[] = []
  doc.on('data', c => chunks.push(c))
  doc.on('end', () => {})

  doc.fontSize(18).text('Booking Invoice', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12).text(`Booking ID: ${booking.id}`)
  doc.text(`Boat: ${booking.boat.title}`)
  doc.text(`Guest: ${booking.user.name} (${booking.user.email})`)
  doc.text(`Dates: ${booking.startDate.toDateString()} → ${booking.endDate.toDateString()}`)
  doc.text(`Status: ${booking.status}`)
  doc.moveDown()
  doc.text(`Subtotal: ৳${booking.subtotal.toLocaleString()}`)
  doc.text(`Service fee: ৳${booking.serviceFee.toLocaleString()}`)
  doc.text(`Total: ৳${booking.total.toLocaleString()}`, { continued: false })
  doc.end()

  const buf = await new Promise<Buffer>((resolve) => {
    const result = Buffer.concat(chunks)
    resolve(result)
  })
  return new Response(buf, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="invoice-${booking.id}.pdf"` }
  })
}
