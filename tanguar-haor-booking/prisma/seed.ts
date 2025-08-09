import { PrismaClient, Role, BoatType, BoatStatus, BookingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.local' },
    update: {},
    create: {
      role: 'admin',
      name: 'Admin',
      email: 'admin@demo.local',
      password: await bcrypt.hash('admin123', 10),
      kycStatus: 'approved',
    },
  })

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@demo.local' },
    update: {},
    create: {
      role: 'owner',
      name: 'Boat Owner 1',
      email: 'owner1@demo.local',
      password: await bcrypt.hash('owner123', 10),
      kycStatus: 'approved',
      ownerProfile: {
        create: {
          businessName: 'Haor Waves Ltd.',
          nidOrTrade: 'TRD-123456',
          payoutMethod: 'bKash',
          payoutAccount: '017XXXXXXXX',
        },
      },
    },
  })

  const guest1 = await prisma.user.upsert({
    where: { email: 'guest1@demo.local' },
    update: {},
    create: {
      role: 'guest',
      name: 'Guest One',
      email: 'guest1@demo.local',
      password: await bcrypt.hash('guest123', 10),
    },
  })

  // Boats (5 sample)
  const sampleBoats = [
    {
      title: 'Surma Queen',
      slug: 'surma-queen',
      description: 'Comfortable overnight houseboat with rooftop deck and chef option. Perfect for families.',
      type: 'whole',
      capacity: 12,
      cabinCount: 3,
      amenities: { lifeJackets: true, washroom: true, ac: false, generator: true, rooftop: true, crew: 4 },
      pickupGhat: 'Tahirpur Ghat',
      lat: 25.089,
      lng: 91.112,
      basePrice: 18000,
      weekendPrice: 22000,
      currency: 'BDT',
      status: 'active',
      photos: [
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop'
      ],
      addOns: [{ name: 'BBQ Dinner', price: 1500, perPerson: false }, { name: 'Fishing Kit', price: 500, perPerson: true }, { name: 'Drone Permit', price: 2000, perPerson: false }],
      blocks: [{ startDate: '2025-08-15', endDate: '2025-08-17', note: 'Maintenance' }]
    },
    {
      title: 'Tanguar Breeze',
      slug: 'tanguar-breeze',
      description: 'Day-cruise boat with shaded deck and sound system.',
      type: 'seat',
      capacity: 30,
      cabinCount: 0,
      amenities: { lifeJackets: true, washroom: true, ac: false, generator: true, rooftop: false, crew: 3 },
      pickupGhat: 'Shalla Ghat',
      lat: 25.039,
      lng: 91.157,
      basePrice: 800,
      weekendPrice: 1000,
      currency: 'BDT',
      status: 'active',
      photos: [
        'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop'
      ],
      addOns: [{ name: 'Lunch (per person)', price: 400, perPerson: true }, { name: 'Tea & Snacks', price: 150, perPerson: true }, { name: 'Life Jacket Rental', price: 50, perPerson: true }],
      blocks: []
    },
    {
      title: 'Haor Explorer',
      slug: 'haor-explorer',
      description: 'Multi-day exploration boat; generator, cook, and guide included.',
      type: 'whole',
      capacity: 10,
      cabinCount: 2,
      amenities: { lifeJackets: true, washroom: true, ac: false, generator: true, rooftop: true, crew: 5 },
      pickupGhat: 'Tahirpur Ghat',
      lat: 25.08,
      lng: 91.1,
      basePrice: 15000,
      weekendPrice: 18000,
      currency: 'BDT',
      status: 'active',
      photos: [
        'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=1600&auto=format&fit=crop'
      ],
      addOns: [{ name: 'Chef Service', price: 1200, perPerson: false }, { name: 'BBQ Dinner', price: 1500, perPerson: false }, { name: 'Fishing Kit', price: 400, perPerson: true }],
      blocks: [{ startDate: '2025-08-10', endDate: '2025-08-11', note: 'Private Use' }]
    },
    {
      title: 'Sunamganj Star',
      slug: 'sunamganj-star',
      description: 'Cabin-based boat; book per cabin with ensuite washroom.',
      type: 'cabin',
      capacity: 8,
      cabinCount: 4,
      amenities: { lifeJackets: true, washroom: true, ac: true, generator: true, rooftop: false, crew: 3 },
      pickupGhat: 'Doarabazar Ghat',
      lat: 25.05,
      lng: 91.2,
      basePrice: 3500,
      weekendPrice: 4200,
      currency: 'BDT',
      status: 'active',
      photos: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop'
      ],
      addOns: [{ name: 'Breakfast (per person)', price: 200, perPerson: true }, { name: 'Dinner (per person)', price: 500, perPerson: true }, { name: 'Tea & Snacks', price: 150, perPerson: true }],
      blocks: []
    },
    {
      title: 'Rooftop Dream',
      slug: 'rooftop-dream',
      description: 'Big rooftop deck with scenic views; perfect for sunsets.',
      type: 'whole',
      capacity: 14,
      cabinCount: 3,
      amenities: { lifeJackets: true, washroom: true, ac: false, generator: true, rooftop: true, crew: 4 },
      pickupGhat: 'Tahirpur Ghat',
      lat: 25.09,
      lng: 91.12,
      basePrice: 20000,
      weekendPrice: 24000,
      currency: 'BDT',
      status: 'active',
      photos: [
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1600&auto=format&fit=crop'
      ],
      addOns: [{ name: 'Live Music', price: 3000, perPerson: false }, { name: 'BBQ Dinner', price: 1500, perPerson: false }, { name: 'Fishing Kit', price: 400, perPerson: true }],
      blocks: [{ startDate: '2025-08-20', endDate: '2025-08-21', note: 'Maintenance' }]
    }
  ]

  for (const b of sampleBoats) {
    const boat = await prisma.boat.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        ownerId: owner1.id,
        title: b.title,
        slug: b.slug,
        description: b.description,
        type: b.type as any,
        capacity: b.capacity,
        cabinCount: b.cabinCount,
        amenities: b.amenities,
        pickupGhat: b.pickupGhat,
        lat: b.lat,
        lng: b.lng,
        basePrice: b.basePrice,
        weekendPrice: b.weekendPrice,
        currency: b.currency,
        status: 'active',
        photos: {
          create: b.photos.map((url, i) => ({ url, sortOrder: i })),
        },
        addOns: {
          create: b.addOns.map((a:any) => ({ name: a.name, price: a.price, perPerson: a.perPerson }))
        },
        blocks: {
          create: b.blocks.map((blk:any) => ({
            startDate: new Date(blk.startDate + "T00:00:00Z"),
            endDate: new Date(blk.endDate + "T23:59:59Z"),
            note: blk.note,
            createdBy: owner1.id,
          }))
        }
      }
    })
  }

  // Sample bookings
  const boat1 = await prisma.boat.findUnique({ where: { slug: 'surma-queen' } })
  if (boat1) {
    await prisma.booking.create({
      data: {
        boatId: boat1.id,
        userId: guest1.id,
        type: boat1.type,
        startDate: new Date('2025-08-12T00:00:00Z'),
        endDate: new Date('2025-08-14T00:00:00Z'),
        guests: 6,
        subtotal: 36000,
        total: 36000,
        status: 'paid',
        paymentMethod: 'manual',
        paymentRef: 'DEMO-PAID-001',
      }
    })
  }
  console.log('Seed complete')
}

main().then(() => prisma.$disconnect())
.catch(e => { console.error(e); process.exit(1) })
