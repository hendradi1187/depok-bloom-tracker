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
    // Bonsai Anting Putri - 9 lokasi
    {
      barcode: 'DPK-BON-001',
      common_name: 'Bonsai Santigi',
      latin_name: 'Pemphis acidula',
      category_id: catMap['Bonsai'],
      description: 'Bonsai santigi dengan batang keras dan daun kecil mengkilap. Tahan terhadap angin laut dan cuaca ekstrem, cocok untuk bonsai bentuk cascade atau semi-cascade.',
      care_guide: 'Siram 2x sehari, butuh sinar matahari penuh minimal 6 jam, pangkas secara berkala, pupuk organik setiap 3 minggu.',
      location: 'Jl. Kp. Benda Bar. No.66-71, Cipayung, Kota Depok',
      supplier: 'Kebun Bonsai Cipayung',
      latitude: -6.414633340581161,
      longitude: 106.78897214078167,
    },
    {
      barcode: 'DPK-BON-002',
      common_name: 'Bonsai Santigi',
      latin_name: 'Pemphis acidula',
      category_id: catMap['Bonsai'],
      description: 'Bonsai santigi dengan batang keras dan daun kecil mengkilap. Tahan terhadap angin laut dan cuaca ekstrem, cocok untuk bonsai bentuk cascade atau semi-cascade.',
      care_guide: 'Siram 2x sehari, butuh sinar matahari penuh minimal 6 jam, pangkas secara berkala, pupuk organik setiap 3 minggu.',
      location: 'Kebun Bonsai Beji, Jl. Mandor Basyir II No.58C, Kukusan, Beji',
      supplier: 'Kebun Bonsai Beji',
      latitude: -6.373882074760148,
      longitude: 106.81407491533103,
    },
    {
      barcode: 'DPK-BON-003',
      common_name: 'Bonsai Beringin Korea',
      latin_name: 'Ficus microcarpa',
      category_id: catMap['Bonsai'],
      description: 'Bonsai beringin Korea dengan akar udara yang unik dan daun kecil rapat. Pertumbuhan cepat dan mudah dibentuk, sangat populer untuk pemula.',
      care_guide: 'Siram saat media mulai kering, tempatkan di area teduh parsial, pangkas tunas baru rutin, pupuk NPK setiap 2 minggu.',
      location: 'Gallery Bonsai Sawangan, Sawangan, Kota Depok',
      supplier: 'Gallery Bonsai Sawangan',
      latitude: -6.42091428479333,
      longitude: 106.75058942883035,
    },
    {
      barcode: 'DPK-BON-004',
      common_name: 'Bonsai Beringin Korea',
      latin_name: 'Ficus microcarpa',
      category_id: catMap['Bonsai'],
      description: 'Bonsai beringin Korea dengan akar udara yang unik dan daun kecil rapat. Pertumbuhan cepat dan mudah dibentuk, sangat populer untuk pemula.',
      care_guide: 'Siram saat media mulai kering, tempatkan di area teduh parsial, pangkas tunas baru rutin, pupuk NPK setiap 2 minggu.',
      location: 'Sanggar Senam Nanda, Jl. sekitar Kukusan, Depok',
      supplier: 'Sanggar Senam Nanda',
      latitude: -6.364974523278928,
      longitude: 106.84126091007333,
    },
    {
      barcode: 'DPK-BON-005',
      common_name: 'Bonsai Anting Putri',
      latin_name: 'Wrightia religiosa',
      category_id: catMap['Bonsai'],
      description: 'Bonsai Anting Putri dengan bunga putih harum seperti melati. Batang unik dengan alur dan tekstur menarik, cocok untuk bonsai.',
      care_guide: 'Siram setiap hari pagi dan sore, jemur 4-6 jam per hari, pangkas rutin untuk menjaga bentuk, beri pupuk NPK setiap 2 minggu.',
      location: 'Jl. HR. Basorun No.71, Depok',
      supplier: 'Koleksi Pribadi',
      latitude: -6.444576857238909,
      longitude: 106.80303092883828,
    },
    {
      barcode: 'DPK-BON-006',
      common_name: 'Bonsai Anting Putri',
      latin_name: 'Wrightia religiosa',
      category_id: catMap['Bonsai'],
      description: 'Bonsai Anting Putri dengan bunga putih harum seperti melati. Batang unik dengan alur dan tekstur menarik, cocok untuk bonsai.',
      care_guide: 'Siram setiap hari pagi dan sore, jemur 4-6 jam per hari, pangkas rutin untuk menjaga bentuk, beri pupuk NPK setiap 2 minggu.',
      location: 'PPBI Cabang Depok Ranting Tapos, Jl. Lembah Raya No.5, Tapos',
      supplier: 'PPBI Depok Ranting Tapos',
      latitude: -6.43066855081249,
      longitude: 106.88076369999195,
    },
    {
      barcode: 'DPK-BON-007',
      common_name: 'Bonsai Anting Putri',
      latin_name: 'Wrightia religiosa',
      category_id: catMap['Bonsai'],
      description: 'Bonsai Anting Putri dengan bunga putih harum seperti melati. Batang unik dengan alur dan tekstur menarik, cocok untuk bonsai.',
      care_guide: 'Siram setiap hari pagi dan sore, jemur 4-6 jam per hari, pangkas rutin untuk menjaga bentuk, beri pupuk NPK setiap 2 minggu.',
      location: 'Ranting Sukmajaya, Sukmajaya, Kota Depok',
      supplier: 'PPBI Depok Ranting Sukmajaya',
      latitude: -6.409959666479041,
      longitude: 106.84662774002274,
    },
    {
      barcode: 'DPK-BON-008',
      common_name: 'Bonsai Kimeng',
      latin_name: 'Ficus microcarpa',
      category_id: catMap['Bonsai'],
      description: 'Bonsai kimeng dengan batang unik berlekuk dan akar menawan. Sangat tahan banting, mudah perawatan, dan cocok untuk gaya informal upright.',
      care_guide: 'Siram rutin pagi hari, butuh cahaya terang tidak langsung, pemangkasan minimal, beri pupuk cair setiap 3 minggu.',
      location: 'Say Bonsai, Jl. Cemara Raya Blok A2 No.6, Sukamaju',
      supplier: 'Say Bonsai',
      latitude: -6.41686462928847,
      longitude: 106.85317108649438,
    },
    {
      barcode: 'DPK-BON-009',
      common_name: 'Bonsai Kimeng',
      latin_name: 'Ficus microcarpa',
      category_id: catMap['Bonsai'],
      description: 'Bonsai kimeng dengan batang unik berlekuk dan akar menawan. Sangat tahan banting, mudah perawatan, dan cocok untuk gaya informal upright.',
      care_guide: 'Siram rutin pagi hari, butuh cahaya terang tidak langsung, pemangkasan minimal, beri pupuk cair setiap 3 minggu.',
      location: 'PPBI Depok Suiseki, Depok',
      supplier: 'PPBI Depok Suiseki',
      latitude: -6.399176788399981,
      longitude: 106.88649591532426,
    },
  ]

  for (const plant of plants) {
    await prisma.plant.upsert({
      where: { barcode: plant.barcode },
      update: {},
      create: plant,
    })
  }
  console.log(`✅ ${plants.length} tanaman selesai (6 tanaman hias + 9 bonsai: 2 Santigi, 2 Beringin Korea, 3 Anting Putri, 2 Kimeng)`)

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
