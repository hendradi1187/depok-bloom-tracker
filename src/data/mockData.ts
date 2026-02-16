export interface Plant {
  id: string;
  barcode: string;
  common_name: string;
  latin_name: string;
  category: string;
  description: string;
  care_guide: string;
  location: string;
  supplier: string;
  created_at: string;
  images: string[];
}

export interface ScanRecord {
  id: string;
  user_id: string;
  plant_id: string;
  scanned_at: string;
  location: string;
  plant?: Plant;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Perdu", count: 45 },
  { id: "2", name: "Pohon Hias", count: 32 },
  { id: "3", name: "Tanaman Merambat", count: 18 },
  { id: "4", name: "Sukulen", count: 24 },
  { id: "5", name: "Bunga Potong", count: 15 },
  { id: "6", name: "Tanaman Air", count: 8 },
];

export const MOCK_PLANTS: Plant[] = [
  {
    id: "1",
    barcode: "DPK-ORN-001",
    common_name: "Bougenville Ungu",
    latin_name: "Bougainvillea spectabilis",
    category: "Perdu",
    description: "Tanaman hias yang populer dengan bunga berwarna ungu cerah, sering digunakan untuk penghijauan kota.",
    care_guide: "Siram 2x seminggu. Pangkas rutin setiap bulan. Tahan panas matahari langsung.",
    location: "Kec. Pancoran Mas, Kel. Depok",
    supplier: "Dinas Pertamanan Kota Depok",
    created_at: "2024-01-15",
    images: [],
  },
  {
    id: "2",
    barcode: "DPK-ORN-002",
    common_name: "Pucuk Merah",
    latin_name: "Syzygium oleana",
    category: "Pohon Hias",
    description: "Pohon hias dengan daun muda berwarna merah menyala, cocok untuk pagar hidup dan taman kota.",
    care_guide: "Siram setiap hari di musim kemarau. Pemupukan NPK 2x sebulan.",
    location: "Kec. Sukmajaya, Kel. Mekarjaya",
    supplier: "CV Taman Indah",
    created_at: "2024-02-20",
    images: [],
  },
  {
    id: "3",
    barcode: "DPK-ORN-003",
    common_name: "Kamboja Merah",
    latin_name: "Plumeria rubra",
    category: "Pohon Hias",
    description: "Pohon hias tropis dengan bunga harum berwarna merah dan putih. Sering ditanam di taman dan jalur hijau.",
    care_guide: "Tahan kering, siram secukupnya. Pangkas cabang kering saat musim hujan.",
    location: "Kec. Beji, Kel. Kemiri Muka",
    supplier: "Dinas Pertamanan Kota Depok",
    created_at: "2024-03-10",
    images: [],
  },
  {
    id: "4",
    barcode: "DPK-ORN-004",
    common_name: "Lidah Mertua",
    latin_name: "Sansevieria trifasciata",
    category: "Sukulen",
    description: "Tanaman hias yang mudah perawatannya, efektif menyerap polusi udara dalam ruangan.",
    care_guide: "Siram 1x seminggu. Hindari genangan air. Cocok untuk indoor maupun outdoor.",
    location: "Kec. Cimanggis, Kel. Tugu",
    supplier: "UD Flora Jaya",
    created_at: "2024-04-05",
    images: [],
  },
  {
    id: "5",
    barcode: "DPK-ORN-005",
    common_name: "Teratai Merah",
    latin_name: "Nymphaea rubra",
    category: "Tanaman Air",
    description: "Tanaman air dengan bunga besar berwarna merah, sering ditemukan di kolam taman kota.",
    care_guide: "Butuh air bersih dan sinar matahari penuh. Bersihkan daun mati secara rutin.",
    location: "Kec. Limo, Kel. Limo",
    supplier: "Dinas Pertamanan Kota Depok",
    created_at: "2024-05-12",
    images: [],
  },
  {
    id: "6",
    barcode: "DPK-ORN-006",
    common_name: "Alamanda Kuning",
    latin_name: "Allamanda cathartica",
    category: "Tanaman Merambat",
    description: "Tanaman merambat dengan bunga kuning cerah berbentuk terompet, ideal untuk pergola dan pagar.",
    care_guide: "Siram teratur, pemupukan 2x sebulan. Perlu media rambat.",
    location: "Kec. Sawangan, Kel. Sawangan Baru",
    supplier: "CV Taman Indah",
    created_at: "2024-06-18",
    images: [],
  },
];

export const MOCK_SCANS: ScanRecord[] = [
  { id: "1", user_id: "u1", plant_id: "1", scanned_at: "2024-12-01 09:30", location: "Kec. Pancoran Mas", plant: MOCK_PLANTS[0] },
  { id: "2", user_id: "u2", plant_id: "3", scanned_at: "2024-12-01 10:15", location: "Kec. Beji", plant: MOCK_PLANTS[2] },
  { id: "3", user_id: "u1", plant_id: "2", scanned_at: "2024-12-02 08:45", location: "Kec. Sukmajaya", plant: MOCK_PLANTS[1] },
  { id: "4", user_id: "u3", plant_id: "5", scanned_at: "2024-12-02 14:20", location: "Kec. Limo", plant: MOCK_PLANTS[4] },
  { id: "5", user_id: "u2", plant_id: "4", scanned_at: "2024-12-03 11:00", location: "Kec. Cimanggis", plant: MOCK_PLANTS[3] },
];
