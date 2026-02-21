import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Perdu' }, update: {}, create: { name: 'Perdu' } }),
    prisma.category.upsert({ where: { name: 'Pohon Hias' }, update: {}, create: { name: 'Pohon Hias' } }),
    prisma.category.upsert({ where: { name: 'Tanaman Merambat' }, update: {}, create: { name: 'Tanaman Merambat' } }),
    prisma.category.upsert({ where: { name: 'Sukulen' }, update: {}, create: { name: 'Sukulen' } }),
    prisma.category.upsert({ where: { name: 'Bunga Potong' }, update: {}, create: { name: 'Bunga Potong' } }),
    prisma.category.upsert({ where: { name: 'Tanaman Air' }, update: {}, create: { name: 'Tanaman Air' } }),
    prisma.category.upsert({ where: { name: 'Bonsai' }, update: {}, create: { name: 'Bonsai' } }),
  ])
  console.log(`✅ ${categories.length} kategori selesai`)

  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]))

  // Plants (dari mockData frontend)
  const plants = [
    {
      barcode: 'DPK-ORN-001',
      common_name: 'Bougainvillea',
      latin_name: 'Bougainvillea spectabilis',
      category_id: catMap['Tanaman Merambat'],
      description: 'Tanaman hias merambat dengan bunga berwarna cerah yang tumbuh subur di iklim tropis Depok.',
      care_guide: 'Siram 2x sehari, beri pupuk NPK sebulan sekali, pangkas rutin untuk bentuk yang rapi.',
      location: 'Kec. Pancoran Mas, Kel. Depok Jaya',
      supplier: 'Dinas Lingkungan Hidup Kota Depok',
      latitude: -6.4025,
      longitude: 106.7942,
    },
    {
      barcode: 'DPK-ORN-002',
      common_name: 'Kamboja Jepang',
      latin_name: 'Adenium obesum',
      category_id: catMap['Sukulen'],
      description: 'Tanaman sukulen dengan batang gemuk dan bunga indah, populer sebagai tanaman hias pot.',
      care_guide: 'Siram seminggu 2x, butuh sinar matahari penuh, media tanam harus porous.',
      location: 'Kec. Beji, Kel. Kukusan',
      supplier: 'CV Nursery Depok Indah',
      latitude: -6.3679,
      longitude: 106.8327,
    },
    {
      barcode: 'DPK-ORN-003',
      common_name: 'Heliconia',
      latin_name: 'Heliconia psittacorum',
      category_id: catMap['Bunga Potong'],
      description: 'Tanaman tropis dengan bunga eksotis berwarna oranye-merah, sering digunakan sebagai bunga potong.',
      care_guide: 'Butuh tanah lembab dan sinar matahari parsial, siram setiap hari.',
      location: 'Kec. Sukmajaya, Kel. Abadijaya',
      supplier: 'Dinas Lingkungan Hidup Kota Depok',
      latitude: -6.3886,
      longitude: 106.8416,
    },
    {
      barcode: 'DPK-ORN-004',
      common_name: 'Puring',
      latin_name: 'Codiaeum variegatum',
      category_id: catMap['Perdu'],
      description: 'Tanaman perdu dengan daun berwarna-warni yang mencolok, sangat populer sebagai tanaman taman.',
      care_guide: 'Siram secara teratur, tempatkan di area yang mendapat sinar matahari cukup.',
      location: 'Kec. Cimanggis, Kel. Harjamukti',
      supplier: 'Taman Kota Depok',
      latitude: -6.3967,
      longitude: 106.8825,
    },
    {
      barcode: 'DPK-ORN-005',
      common_name: 'Teratai',
      latin_name: 'Nelumbo nucifera',
      category_id: catMap['Tanaman Air'],
      description: 'Tanaman air suci yang tumbuh di kolam dan situ, berbunga putih atau merah muda.',
      care_guide: 'Butuh air bersih dan sinar matahari penuh, tanam di lumpur dasar kolam.',
      location: 'Situ Rawa Besar, Kec. Pancoran Mas',
      supplier: 'BPBD Kota Depok',
      latitude: -6.4112,
      longitude: 106.8021,
    },
    {
      barcode: 'DPK-ORN-006',
      common_name: 'Tabebuia',
      latin_name: 'Handroanthus chrysotrichus',
      category_id: catMap['Pohon Hias'],
      description: 'Pohon hias peneduh jalan dengan bunga kuning cerah yang mekar serempak di musim kemarau.',
      care_guide: 'Tahan kekeringan, siram saat masih bibit, tidak perlu perawatan intensif saat dewasa.',
      location: 'Jl. Margonda Raya, Kec. Beji',
      supplier: 'Dinas Pekerjaan Umum Kota Depok',
      latitude: -6.3728,
      longitude: 106.8338,
    },
  ]

  for (const plant of plants) {
    await prisma.plant.upsert({
      where: { barcode: plant.barcode },
      update: {},
      create: plant,
    })
  }
  console.log(`✅ ${plants.length} tanaman selesai`)

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@depok.go.id' },
    update: {},
    create: {
      name: 'Admin Flora Depok',
      email: 'admin@depok.go.id',
      password: hashedPassword,
      role: 'admin',
    },
  })

  await prisma.user.upsert({
    where: { email: 'petugas@depok.go.id' },
    update: {},
    create: {
      name: 'Petugas Lapangan',
      email: 'petugas@depok.go.id',
      password: await bcrypt.hash('petugas123', 10),
      role: 'officer',
    },
  })
  console.log('✅ 2 user selesai')

  console.log('🎉 Seeding selesai!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
