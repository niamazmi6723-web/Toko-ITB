# AZMI DIGITAL STORE

## Menjalankan
1. Ekstrak folder `azmi-digital-store`.
2. Buka `index.html` di browser, atau gunakan ekstensi Live Server di VS Code.
3. Halaman admin: `admin.html`.
4. Login demo: username `admin`, password `azmi123`.

## Mengubah produk
- Cara termudah: buka halaman admin dan gunakan menu Tambah/Edit/Hapus Produk.
- Produk awal otomatis dibuat pada LocalStorage browser saat pertama kali membuka toko.

## Publikasi GitHub Pages
1. Buat repository GitHub bernama `azmi-digital-store`.
2. Upload semua isi folder ini (index.html harus berada di root repository).
3. Buka Settings > Pages.
4. Pada Build and deployment, pilih Deploy from a branch.
5. Pilih branch `main` dan folder `/ (root)`, lalu Save.
6. Tunggu proses selesai dan buka URL GitHub Pages yang diberikan.

## Batasan demo (penting)
GitHub Pages adalah hosting statis. Versi ini menggunakan LocalStorage, sehingga produk, keranjang, dan pesanan tersimpan di browser/perangkat yang sama. Data tidak otomatis dibagikan ke browser pelanggan atau perangkat admin lain.
Login admin di sisi browser hanya untuk demonstrasi dan TIDAK aman untuk toko sungguhan. Jangan gunakan untuk menyimpan data pelanggan sensitif atau memproses pembayaran nyata.
Untuk toko sungguhan, hubungkan database + autentikasi (misalnya Supabase) dan payment gateway resmi. Jangan menyimpan password admin atau secret key di JavaScript publik.
