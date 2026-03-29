# 📊 Executive Summary - Sistem Supplier Flora Depok

## 🎯 Tujuan Program

Melibatkan supplier/UMKM tanaman lokal Kota Depok yang sudah memiliki MOU dengan Dinas Ketahanan Pangan, Pertanian, dan Perikanan untuk:
- Memperluas database tanaman Flora Depok
- Memberdayakan UMKM lokal
- Memberikan akses langsung supplier ke end consumer
- Meningkatkan transparansi dan akuntabilitas supply chain tanaman

---

## 💡 Key Features

### **1. Self-Registration (Public)**
- Supplier mendaftar sendiri via form online
- Upload dokumen MOU sebagai verifikasi
- Gratis, tidak ada biaya registrasi
- Status awal: PENDING (menunggu approval admin)

### **2. Admin Approval System**
- Admin review data supplier + dokumen MOU
- Approve/Reject dengan alasan jelas
- Notifikasi email otomatis ke supplier
- Dashboard monitoring semua supplier

### **3. Supplier Dashboard**
- Kelola tanaman sendiri (CRUD)
- Upload foto produk
- Update harga & stok real-time
- Statistik: total scan, tanaman terjual, dll
- Auto-fill kontak dari profile

### **4. Public Benefits**
- Database tanaman lebih kaya & ter-update
- Kontak langsung ke supplier via WA
- Harga transparan
- Info stok real-time

---

## 🏗️ Technical Architecture

### **Database**
- **New Table**: `supplier_profiles`
- **New Role**: `supplier`
- **New Enum**: `SupplierStatus` (pending/approved/rejected/suspended)
- **Update**: `plants` table link to `supplier_id`

### **Backend APIs** (8 endpoints baru)
1. POST `/api/auth/register-supplier` - Registrasi supplier
2. GET `/api/suppliers` - List suppliers (admin)
3. GET `/api/suppliers/:id` - Detail supplier (admin)
4. POST `/api/suppliers/:id/approve` - Approve supplier (admin)
5. POST `/api/suppliers/:id/reject` - Reject supplier (admin)
6. GET `/api/suppliers/me` - Supplier profile
7. GET `/api/suppliers/me/stats` - Supplier statistics
8. GET `/api/suppliers/me/plants` - Plants by supplier

### **Frontend Pages** (6 pages baru)
1. `/register-supplier` - Public registration form
2. `/supplier/dashboard` - Supplier dashboard
3. `/supplier/plants` - Manage plants
4. `/supplier/plants/new` - Add plant form
5. `/supplier/stats` - Statistics & analytics
6. `/admin/suppliers` - Admin supplier management

---

## 👥 User Roles & Permissions

| Action | Public | Officer | Supplier | Admin |
|--------|--------|---------|----------|-------|
| Register as Supplier | ✅ | ✅ | ❌ | ❌ |
| View Catalog | ✅ | ✅ | ✅ | ✅ |
| Add Own Plants | ❌ | ❌ | ✅ | ✅ |
| Edit Own Plants | ❌ | ❌ | ✅ | ✅ |
| View Own Stats | ❌ | ❌ | ✅ | ✅ |
| Approve Suppliers | ❌ | ❌ | ❌ | ✅ |
| Manage All Plants | ❌ | ❌ | ❌ | ✅ |

---

## 📈 Expected Impact

### **Short Term (3 Bulan)**
- **20+ suppliers** terdaftar
- **100+ tanaman baru** dari supplier
- **30% peningkatan** database diversity
- **Reduced admin workload** (supplier manage sendiri)

### **Medium Term (6 Bulan)**
- **50+ suppliers** active
- **500+ tanaman** dari supplier
- **Direct buyer-seller** connection via WA
- **Community building** antar supplier

### **Long Term (1 Tahun)**
- **100+ suppliers** di seluruh Depok
- **Marketplace integration** (optional)
- **Mobile app** untuk supplier
- **Export program** ke kota lain

---

## 💰 Cost-Benefit Analysis

### **Costs**
- ✅ **Development**: 0 (internal team)
- ✅ **Infrastructure**: Sudah tersedia (Docker, hosting)
- ✅ **Maintenance**: Minimal (self-service system)
- ✅ **Program**: GRATIS untuk supplier

### **Benefits**
- 💰 **Increased Database**: 5x lipat dalam 6 bulan
- 💰 **UMKM Empowerment**: Direct market access
- 💰 **Public Service**: Better catalog for citizens
- 💰 **Brand**: Depok sebagai kota digital & UMKM-friendly
- 💰 **Revenue Potential**: Ads, premium listings (future)

**ROI**: High (minimal cost, significant impact)

---

## ⏱️ Implementation Timeline

### **Phase 1: Foundation (Week 1-2)**
- Database migration
- Backend API development
- Basic supplier registration flow

### **Phase 2: Core Features (Week 3-4)**
- Supplier dashboard
- Plant management (CRUD)
- Admin approval system

### **Phase 3: Enhancement (Week 5-6)**
- Statistics & analytics
- Email notifications
- Document upload system

### **Phase 4: Testing & Launch (Week 7-8)**
- User acceptance testing
- Bug fixes
- Soft launch dengan 5 pilot suppliers
- Public announcement

**Total**: 8 minggu (2 bulan)

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Fake registrations** | Medium | MOU document verification by admin |
| **Low supplier adoption** | High | Dinas outreach, training workshops |
| **Quality control** | Medium | Admin can suspend suppliers |
| **Data accuracy** | Low | Suppliers responsible for own data |
| **System overload** | Low | Scalable architecture (Docker) |

---

## ✅ Success Criteria

### **KPIs to Track**
1. **Supplier Registration Rate**: Target 20 dalam 3 bulan
2. **Approval Rate**: Target >80% approved
3. **Active Supplier Rate**: Target >70% aktif tambah tanaman
4. **Plant Addition Rate**: Target min 5 tanaman/supplier/bulan
5. **Public Engagement**: Target 10% increase in catalog scans

### **User Satisfaction**
- Survey supplier setiap 3 bulan
- NPS (Net Promoter Score) target: >8/10
- Response time approval: <3 hari kerja

---

## 🎬 Next Steps

### **Immediate Actions Needed:**
1. ✅ Review dokumentasi lengkap (`SUPPLIER_SYSTEM_GUIDE.md`)
2. ✅ Review UI mockups (`SUPPLIER_UI_MOCKUPS.md`)
3. ⏳ **Decision**: Approve implementasi?
4. ⏳ **Resource**: Assign developer + timeline
5. ⏳ **Stakeholder**: Inform Dinas untuk prepare pilot suppliers

### **Questions to Answer:**
- Siapa PIC dari Dinas untuk koordinasi supplier?
- Apakah ada template MOU yang bisa di-share?
- Berapa target supplier tahun ini?
- Apakah perlu training workshop untuk supplier?
- Timeline launch ideal kapan?

---

## 📞 Contact

**Technical Implementation:**
- Developer: [Your Name]
- Timeline: 8 weeks
- Budget: Rp 0 (internal)

**Program Coordination:**
- Dinas PIC: [TBD]
- Supplier Liaison: [TBD]

---

**Dokumen ini siap untuk:**
- ✅ Presentasi ke Kepala Dinas
- ✅ Approval stakeholder
- ✅ Developer handoff
- ✅ Project kickoff

---

**Status:** DRAFT - Waiting for Approval
**Date:** 25 Februari 2026
**Version:** 1.0
