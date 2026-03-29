# 📋 Dokumentasi Sistem Registrasi Supplier Flora Depok

## 🎯 Overview

Sistem untuk melibatkan supplier/UMKM tanaman lokal Kota Depok yang sudah MOU dengan Dinas Ketahanan Pangan, Pertanian, dan Perikanan. Supplier dapat mendaftarkan diri, mengelola tanaman mereka sendiri, dan berkontribusi ke database Flora Depok.

---

## 🏗️ Arsitektur Sistem

### **1. Database Schema**

#### **Tabel Baru: `supplier_profiles`**
```sql
CREATE TABLE supplier_profiles (
  id                TEXT PRIMARY KEY,
  user_id           TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name     TEXT NOT NULL,           -- Nama Usaha
  business_address  TEXT NOT NULL,           -- Alamat Usaha
  npwp              TEXT,                    -- NPWP (opsional)
  contact_person    TEXT NOT NULL,           -- Nama Penanggung Jawab
  phone             TEXT NOT NULL,           -- Nomor HP
  whatsapp          TEXT,                    -- Nomor WhatsApp
  plant_categories  TEXT NOT NULL,           -- JSON array kategori tanaman
  mou_document_url  TEXT,                    -- URL dokumen MOU
  status            TEXT DEFAULT 'pending',  -- pending | approved | rejected | suspended
  approved_by       TEXT,                    -- User ID admin yang approve
  approved_at       TIMESTAMP,               -- Waktu approval
  rejection_reason  TEXT,                    -- Alasan reject (jika ada)
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);
```

#### **Update Tabel: `users`**
```sql
-- Tambah role 'supplier' ke enum Role
ALTER TYPE role ADD VALUE 'supplier';

-- User bisa punya 1 supplier_profile (one-to-one)
```

#### **Update Tabel: `plants`**
```sql
-- Tambah kolom supplier_id
ALTER TABLE plants ADD COLUMN supplier_id TEXT REFERENCES supplier_profiles(id);

-- Tanaman bisa dimiliki oleh supplier (optional)
```

---

## 🔐 Role & Permission Matrix

| Feature | Public | Officer | Supplier | Admin |
|---------|--------|---------|----------|-------|
| **View Homepage/Catalog/Map** | ✅ | ✅ | ✅ | ✅ |
| **Scan QR (View)** | ✅ | ✅ | ✅ | ✅ |
| **Record Scan** | ❌ | ✅ | ❌ | ✅ |
| **Registrasi Supplier** | ✅ | ✅ | ❌ | ❌ |
| **Dashboard Supplier** | ❌ | ❌ | ✅ | ✅ |
| **Tambah Tanaman Sendiri** | ❌ | ❌ | ✅ | ✅ |
| **Edit Tanaman Sendiri** | ❌ | ❌ | ✅ | ✅ |
| **Delete Tanaman Sendiri** | ❌ | ❌ | ✅ | ✅ |
| **Upload Foto Tanaman** | ❌ | ❌ | ✅ | ✅ |
| **Update Harga & Stok** | ❌ | ❌ | ✅ | ✅ |
| **Lihat Statistik Tanaman** | ❌ | ❌ | ✅ | ✅ |
| **Approve/Reject Supplier** | ❌ | ❌ | ❌ | ✅ |
| **Suspend Supplier** | ❌ | ❌ | ❌ | ✅ |
| **Admin Dashboard** | ❌ | ❌ | ❌ | ✅ |

---

## 🎨 UI/UX Design

### **1. Halaman Registrasi Supplier (`/register-supplier`)**

**URL:** Accessible untuk PUBLIC (siapa saja bisa register)

**Form Fields:**

#### **A. Data Usaha**
- **Nama Usaha** (required) - Text input
- **Alamat Usaha** (required) - Textarea
- **NPWP** (optional) - Text input dengan format mask
- **Jenis Tanaman yang Dijual** (required) - Multiple checkbox/select
  - [ ] Bonsai
  - [ ] Pohon Hias
  - [ ] Perdu
  - [ ] Tanaman Merambat
  - [ ] Sukulen
  - [ ] Bunga Potong
  - [ ] Tanaman Air

#### **B. Data Kontak**
- **Nama Penanggung Jawab** (required) - Text input
- **Nomor HP** (required) - Text input dengan format (+62)
- **Nomor WhatsApp** (optional) - Text input
- **Email** (required) - Email input

#### **C. Data Akun**
- **Password** (required) - Password input (min 8 karakter)
- **Konfirmasi Password** (required) - Password input

#### **D. Dokumen**
- **Upload Dokumen MOU** (required) - File upload (PDF/JPG/PNG, max 5MB)
  - Preview dokumen setelah upload
  - Catatan: "Dokumen MOU dengan Dinas Ketahanan Pangan, Pertanian, dan Perikanan Kota Depok"

#### **E. Persetujuan**
- [ ] **Syarat & Ketentuan** (required checkbox)
  - "Saya menyatakan bahwa data yang saya berikan adalah benar dan saya bersedia mengikuti aturan program Flora Depok"

**Button:**
- **Daftar Sebagai Supplier** (Primary button)
- **Kembali ke Login** (Link)

**Success State:**
```
✅ Registrasi Berhasil!

Terima kasih telah mendaftar sebagai supplier Flora Depok.

Status: Menunggu Persetujuan
Akun Anda sedang dalam proses verifikasi oleh tim admin.
Anda akan menerima notifikasi via email setelah akun disetujui.

Email: supplier@example.com
Status: PENDING

[Kembali ke Homepage]
```

---

### **2. Dashboard Supplier (`/supplier/dashboard`)**

**Access:** Hanya supplier dengan status `approved`

**Sections:**

#### **A. Header Dashboard**
```
🌿 Dashboard Supplier - [Nama Usaha]
Status: APPROVED | Member sejak: 25 Feb 2026
```

#### **B. Statistik Cards**
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Total Tanaman   │ Total Scan      │ Tanaman Terjual │ Tanaman Aktif   │
│      12         │      145        │       3         │       9         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

#### **C. Tanaman Saya**
Table dengan kolom:
- **Foto** (thumbnail)
- **Nama Tanaman** (Common + Latin)
- **Kategori** (badge)
- **Harga** (Rp)
- **Status** (Available/Sold/On Display)
- **Total Scan**
- **Aksi** (Edit/Delete/Upload Foto)

**Buttons:**
- [+ Tambah Tanaman Baru] (Primary button)
- [📥 Export Data] (Secondary button)

#### **D. Grafik Statistik**
- Line chart: Scan per minggu (4 minggu terakhir)
- Bar chart: Tanaman paling populer (top 5)

---

### **3. Halaman Admin - Approve Supplier (`/admin/suppliers`)**

**Access:** Admin only

**Tabs:**
- **Pending** (butuh approval)
- **Approved** (sudah disetujui)
- **Rejected** (ditolak)
- **Suspended** (disuspend)

**Card untuk setiap supplier pending:**
```
┌──────────────────────────────────────────────────────────────┐
│ 🏢 Kebun Bonsai Makmur                      STATUS: PENDING  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 📧 Email: bonsai@example.com                                │
│ 👤 Penanggung Jawab: Budi Santoso                           │
│ 📱 HP: +62812-3456-7890                                     │
│ 🏠 Alamat: Jl. Raya Sawangan No. 123, Depok                │
│ 🌿 Kategori: Bonsai, Pohon Hias                            │
│ 📄 NPWP: 12.345.678.9-012.000                              │
│                                                              │
│ 📎 Dokumen MOU: [📄 View Document] [⬇️ Download]           │
│                                                              │
│ 📅 Daftar: 25 Feb 2026, 10:30 WIB                          │
│                                                              │
│ ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│ │ ✅ APPROVE     │  │ ❌ REJECT      │  │ 👁️ VIEW DETAIL│ │
│ └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Modal Approve:**
```
Setujui Supplier?

Apakah Anda yakin ingin menyetujui registrasi:
📧 Email: bonsai@example.com
🏢 Nama Usaha: Kebun Bonsai Makmur

Setelah disetujui, supplier dapat:
✅ Login ke dashboard
✅ Menambah tanaman
✅ Mengelola stok dan harga

[Batal]  [✅ Setujui]
```

**Modal Reject:**
```
Tolak Registrasi Supplier

📧 Email: bonsai@example.com
🏢 Nama Usaha: Kebun Bonsai Makmur

Alasan Penolakan: *
┌─────────────────────────────────────────┐
│ Dokumen MOU tidak lengkap               │
│                                         │
│                                         │
└─────────────────────────────────────────┘

[Batal]  [❌ Tolak Registrasi]
```

---

### **4. Form Tambah/Edit Tanaman Supplier (`/supplier/plants/new`)**

**Fields:**

#### **A. Informasi Dasar**
- **Kode Barcode** (auto-generate atau manual)
- **Nama Umum** (required)
- **Nama Latin** (required)
- **Kategori** (dropdown, dari kategori yang dipilih saat registrasi)

#### **B. Deskripsi**
- **Deskripsi Tanaman** (textarea)
- **Panduan Perawatan** (textarea)

#### **C. Harga & Status**
- **Harga** (number input, Rp)
- **Grade** (optional: A, B, C, S)
- **Status** (dropdown: Available / Sold / On Display)

#### **D. Lokasi**
- **Lokasi** (text input - alamat toko/kebun)
- **Latitude** (optional, untuk peta)
- **Longitude** (optional, untuk peta)

#### **E. Foto**
- **Upload Foto Tanaman** (multiple files, max 5 foto, 2MB per foto)
- Preview thumbnails dengan tombol delete

**Buttons:**
- [💾 Simpan Tanaman]
- [❌ Batal]

**Auto-fill:**
- **Supplier** (otomatis diisi dari data supplier profile)
- **Kontak Supplier** (otomatis diisi dari phone supplier)

---

## 🔄 User Flow

### **Flow 1: Registrasi Supplier**

```
1. Public user → Klik "Daftar Sebagai Supplier" di homepage/navbar
2. Fill form registrasi (data usaha, kontak, dokumen MOU)
3. Submit form
4. Backend: Create user (role: supplier, is_active: false)
5. Backend: Create supplier_profile (status: pending)
6. Backend: Upload dokumen MOU ke storage
7. Frontend: Show success message "Menunggu Persetujuan"
8. Email: Send notification ke admin ada supplier baru
```

### **Flow 2: Admin Approve Supplier**

```
1. Admin login → Navigate to /admin/suppliers
2. See list pending suppliers
3. Click "View Detail" → Modal shows full info + MOU document
4. Click "✅ APPROVE"
5. Backend: Update supplier_profile.status = 'approved'
6. Backend: Update user.is_active = true
7. Backend: Save approved_by (admin user id) & approved_at (timestamp)
8. Email: Send approval email ke supplier
9. Frontend: Supplier moved to "Approved" tab
```

### **Flow 3: Supplier Kelola Tanaman**

```
1. Supplier login → Redirect to /supplier/dashboard
2. Click "+ Tambah Tanaman Baru"
3. Fill form tanaman (nama, deskripsi, harga, foto)
4. Submit form
5. Backend: Create plant dengan supplier_id = supplier profile id
6. Backend: Auto-fill supplier & supplier_contact dari profile
7. Frontend: Tanaman muncul di dashboard supplier
8. Public: Tanaman muncul di catalog untuk semua user
```

---

## 📡 Backend API Endpoints

### **1. Registrasi Supplier**
```http
POST /api/auth/register-supplier

Body (multipart/form-data):
{
  "name": "Budi Santoso",
  "email": "budi@kebunbonsai.com",
  "password": "password123",
  "business_name": "Kebun Bonsai Makmur",
  "business_address": "Jl. Raya Sawangan No. 123",
  "npwp": "12.345.678.9-012.000",
  "contact_person": "Budi Santoso",
  "phone": "+628123456789",
  "whatsapp": "+628123456789",
  "plant_categories": ["Bonsai", "Pohon Hias"],
  "mou_document": File (PDF/Image)
}

Response 201:
{
  "message": "Registrasi berhasil. Menunggu persetujuan admin.",
  "email": "budi@kebunbonsai.com",
  "status": "pending"
}
```

### **2. Get Pending Suppliers (Admin)**
```http
GET /api/suppliers?status=pending
Authorization: Bearer [admin_token]

Response 200:
{
  "data": [
    {
      "id": "...",
      "user": {
        "email": "budi@kebunbonsai.com",
        "name": "Budi Santoso"
      },
      "business_name": "Kebun Bonsai Makmur",
      "business_address": "...",
      "phone": "...",
      "mou_document_url": "/uploads/mou/...",
      "status": "pending",
      "created_at": "..."
    }
  ]
}
```

### **3. Approve Supplier**
```http
POST /api/suppliers/:id/approve
Authorization: Bearer [admin_token]

Response 200:
{
  "message": "Supplier berhasil disetujui",
  "supplier_id": "...",
  "status": "approved"
}
```

### **4. Reject Supplier**
```http
POST /api/suppliers/:id/reject
Authorization: Bearer [admin_token]

Body:
{
  "rejection_reason": "Dokumen MOU tidak lengkap"
}

Response 200:
{
  "message": "Supplier ditolak",
  "supplier_id": "...",
  "status": "rejected"
}
```

### **5. Get Supplier Dashboard Stats**
```http
GET /api/suppliers/me/stats
Authorization: Bearer [supplier_token]

Response 200:
{
  "total_plants": 12,
  "total_scans": 145,
  "plants_sold": 3,
  "plants_active": 9,
  "scan_stats": {
    "this_week": 25,
    "last_week": 18,
    "growth": "+38.8%"
  }
}
```

### **6. Supplier Tambah Tanaman**
```http
POST /api/plants
Authorization: Bearer [supplier_token]

Body:
{
  "barcode": "DPK-SUP-001",
  "common_name": "Bonsai Beringin Mini",
  "latin_name": "Ficus benjamina",
  "category_id": "...",
  "description": "...",
  "care_guide": "...",
  "location": "Kebun Bonsai Makmur, Sawangan",
  "price": 150000,
  "status": "available",
  "grade": "A"
}

Response 201:
{
  "id": "...",
  "barcode": "DPK-SUP-001",
  "supplier": "Kebun Bonsai Makmur",
  "supplier_contact": "+628123456789",
  "supplier_id": "..."
}
```

---

## 🗂️ File Structure (To Be Created)

### **Frontend**
```
src/
├── pages/
│   ├── RegisterSupplier.tsx         (NEW)
│   ├── supplier/
│   │   ├── Dashboard.tsx            (NEW)
│   │   ├── PlantForm.tsx            (NEW)
│   │   ├── PlantList.tsx            (NEW)
│   │   └── Stats.tsx                (NEW)
│   └── admin/
│       └── SupplierManagement.tsx   (NEW)
│
├── components/
│   ├── supplier/
│   │   ├── SupplierNav.tsx          (NEW)
│   │   ├── SupplierStatsCard.tsx    (NEW)
│   │   └── PlantFormSheet.tsx       (NEW - similar to admin)
│   └── admin/
│       ├── SupplierCard.tsx         (NEW)
│       └── SupplierApprovalModal.tsx(NEW)
│
├── hooks/
│   ├── useSuppliers.ts              (NEW)
│   └── useSupplierStats.ts          (NEW)
│
└── types/
    └── api.ts                        (UPDATE - add Supplier types)
```

### **Backend**
```
backend/src/
├── routes/
│   └── supplier.route.ts            (NEW)
│
├── services/
│   └── supplier.service.ts          (NEW)
│
├── schemas/
│   └── supplier.schema.ts           (NEW)
│
├── middleware/
│   └── auth.middleware.ts           (UPDATE - add supplier role)
│
└── prisma/
    ├── schema.prisma                (UPDATED ✅)
    └── migrations/
        └── xxx_add_supplier_system/ (TO BE CREATED)
```

---

## 📝 Migration Steps

### **Step 1: Database Migration**
```bash
# Run migration
docker-compose exec backend npx prisma migrate dev --name add_supplier_system

# Generate Prisma Client
docker-compose exec backend npx prisma generate
```

### **Step 2: Backend Implementation**
1. Create supplier routes & services
2. Update auth middleware for supplier role
3. Add supplier validation schemas
4. Test API endpoints

### **Step 3: Frontend Implementation**
1. Create RegisterSupplier page
2. Create Supplier Dashboard
3. Create Admin Supplier Management
4. Update RBAC & routing
5. Update Navbar for supplier menu

### **Step 4: Testing**
1. Test registrasi supplier flow
2. Test admin approval flow
3. Test supplier CRUD plants
4. Test permission boundaries

---

## 🎯 Success Metrics

### **KPI untuk Program Supplier**
- **Jumlah Supplier Terdaftar**: Target 20 supplier dalam 3 bulan pertama
- **Jumlah Tanaman dari Supplier**: Target 50+ tanaman baru per bulan
- **Tingkat Approval**: Target >80% supplier approved dalam 3 hari
- **Engagement Supplier**: Target setiap supplier aktif tambah min 5 tanaman/bulan
- **Public Scan Rate**: Target 10% peningkatan scan dari tanaman supplier

---

## 💡 Future Enhancements

### **Phase 2: Advance Features**
- [ ] Dashboard analytics lebih detail (grafik penjualan, trend, dll)
- [ ] Notification system (email/WA untuk supplier saat tanaman di-scan)
- [ ] Review & rating system untuk supplier
- [ ] Promo & discount management
- [ ] Bulk upload tanaman via CSV/Excel
- [ ] QR Code generator untuk supplier (print sendiri)
- [ ] Mobile app untuk supplier (React Native)

### **Phase 3: Marketplace Features**
- [ ] Online ordering system
- [ ] Payment gateway integration
- [ ] Delivery tracking
- [ ] Customer chat dengan supplier
- [ ] Loyalty program

---

## 📞 Support

Untuk pertanyaan teknis implementasi, hubungi:
- **Tech Lead**: [Your Name]
- **Dinas PIC**: [Dinas Contact]

---

**Dokumen ini dibuat oleh:** Claude Code (AI Assistant)
**Tanggal:** 25 Februari 2026
**Versi:** 1.0 (Draft)
