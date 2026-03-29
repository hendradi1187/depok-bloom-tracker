# Flora Depok - FASE 2: Marketplace Tanaman

> Dokumen perencanaan untuk pengembangan sistem marketplace yang menghasilkan pendapatan bagi Pemkot Depok dan Supplier.

---

## Stakeholder

| Stakeholder | Peran |
|-------------|-------|
| **Buyer** | Membeli tanaman (masyarakat, instansi, pengembang) |
| **Supplier** | Penjual tanaman (nursery, petani, UMKM) |
| **Pemkot Depok** | Pengelola platform, penerima retribusi |

---

## Model Revenue (Bagi Hasil)

```
Harga Jual: Rp 500.000
├── Supplier mendapat: Rp 475.000 (95%)
└── Retribusi Pemkot:  Rp  25.000 (5%)
```

Persentase dikonfigurasi oleh admin (range: 3-10%)

---

## Fitur yang Akan Dikembangkan

### 1. Fitur Buyer
- [ ] Keranjang Belanja (Cart)
- [ ] Halaman Checkout
- [ ] Pilih Metode Pembayaran
- [ ] Tracking Status Pesanan
- [ ] Riwayat Pembelian

### 2. Fitur Supplier
- [ ] Dashboard Supplier
- [ ] Registrasi & Verifikasi Supplier
- [ ] Kelola Produk Sendiri
- [ ] Terima & Proses Pesanan
- [ ] Konfirmasi Pengiriman
- [ ] Request Pencairan Dana
- [ ] Laporan Penjualan

### 3. Fitur Admin (Pemkot)
- [ ] Verifikasi Supplier Baru
- [ ] Monitor Semua Transaksi
- [ ] Pengaturan Komisi/Fee
- [ ] Laporan Retribusi/Pendapatan Daerah
- [ ] Proses Disbursement ke Supplier

---

## Metode Pembayaran

### Payment Gateway (Pilih salah satu)
| Provider | Fitur | Biaya |
|----------|-------|-------|
| **Midtrans** | VA, E-Wallet, QRIS, CC | ~2-3% per transaksi |
| **Xendit** | VA, E-Wallet, QRIS, CC | ~2-3% per transaksi |

### Metode yang Didukung
- Virtual Account: BCA, Mandiri, BNI, BRI, Permata
- E-Wallet: GoPay, OVO, Dana, ShopeePay, LinkAja
- QRIS: Universal QR Payment
- Kartu Kredit: Visa, Mastercard

### Disbursement ke Supplier
| Provider | Fungsi | Biaya |
|----------|--------|-------|
| **Flip** | Transfer ke rekening supplier | Rp 4.000/transfer |
| **Xendit** | Disbursement API | Rp 5.000/transfer |

---

## Flow Transaksi

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLOW PEMBELIAN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. BUYER                    2. PAYMENT                         │
│  ┌──────────┐               ┌──────────────┐                   │
│  │ Pilih    │───────────────│ Checkout &   │                   │
│  │ Tanaman  │               │ Bayar        │                   │
│  └──────────┘               └──────┬───────┘                   │
│                                    │                            │
│                                    ▼                            │
│                           ┌──────────────┐                      │
│                           │  ESCROW      │                      │
│                           │  (Rekening   │                      │
│                           │   Pemkot)    │                      │
│                           └──────┬───────┘                      │
│                                  │                              │
│  3. SUPPLIER                     │      4. DELIVERY             │
│  ┌──────────┐                    │     ┌──────────┐            │
│  │ Terima & │◄───────────────────┘     │ Buyer    │            │
│  │ Proses   │─────────────────────────►│ Terima   │            │
│  │ Pesanan  │                          │ Barang   │            │
│  └──────────┘                          └────┬─────┘            │
│                                             │                   │
│                                             ▼                   │
│  5. SETTLEMENT                    ┌─────────────────┐          │
│  ┌────────────────────────────────┤ Dana Distribusi │          │
│  │                                └─────────────────┘          │
│  │                                                              │
│  │    ┌─────────────┐         ┌─────────────┐                  │
│  ├───►│ SUPPLIER    │         │ PEMKOT      │◄─────────────────┤
│  │    │ 95%         │         │ 5% Retribusi│                  │
│  │    └─────────────┘         └─────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Baru

### Tabel orders
```sql
- id
- order_number (DPK-ORD-YYYYMMDD-XXXX)
- buyer_id (user)
- supplier_id
- status (pending, paid, processing, shipped, completed, cancelled)
- subtotal
- platform_fee (retribusi)
- total
- shipping_address
- shipping_method
- notes
- created_at
- updated_at
```

### Tabel order_items
```sql
- id
- order_id
- plant_id
- quantity
- unit_price
- subtotal
```

### Tabel payments
```sql
- id
- order_id
- payment_gateway (midtrans/xendit)
- payment_method (va_bca, gopay, qris, etc)
- payment_code (VA number / QR code)
- amount
- status (pending, paid, failed, expired)
- paid_at
- gateway_response (JSON)
```

### Tabel suppliers
```sql
- id
- user_id
- business_name
- business_address
- phone
- bank_name
- bank_account_number
- bank_account_name
- status (pending, verified, suspended)
- verified_at
- created_at
```

### Tabel supplier_balances
```sql
- id
- supplier_id
- available_balance
- pending_balance
- total_earned
- updated_at
```

### Tabel withdrawals
```sql
- id
- supplier_id
- amount
- bank_name
- bank_account_number
- bank_account_name
- status (pending, processing, completed, failed)
- processed_at
- admin_notes
```

### Tabel platform_settings
```sql
- id
- key (platform_fee_percentage, min_withdrawal, etc)
- value
- updated_at
```

---

## Prioritas Pengembangan

| Prioritas | Fitur | Estimasi |
|-----------|-------|----------|
| 1 | Cart & Checkout UI | - |
| 2 | Integrasi Payment Gateway | - |
| 3 | Order Management | - |
| 4 | Supplier Dashboard | - |
| 5 | Disbursement System | - |
| 6 | Reporting & Analytics | - |

---

## Pertanyaan yang Perlu Dijawab

1. **Model bagi hasil**: Berapa % untuk Pemkot vs Supplier?
2. **Payment gateway**: Midtrans atau Xendit?
3. **Supplier registration**: Self-register atau invitation only?
4. **Pengiriman**: Dihandle supplier atau ada opsi pickup?
5. **Minimum withdrawal**: Berapa minimum pencairan supplier?

---

## Status

**Status**: 📋 PLANNED
**Target**: Fase 2 Development
**Created**: 2026-03-29
