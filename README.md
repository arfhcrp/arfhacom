# arfha.com

Situs resmi **Arfha Computindo** (Arfhacorp) — IT Solutions Integrator. Situs statis: HTML + CSS + JS murni, tanpa framework, tanpa layanan pihak ketiga, tanpa cookie/tracker.

## Struktur

```
index.html              halaman tunggal (semua bagian: About, Services, Testimonials,
                        Portfolio, Get a Quote, Contact)
404.html                halaman 404 kustom
content/{en,id,ar,fr,es,ru}.txt
                        berkas bahasa (key=value) yang diambil saat runtime
assets/styles.css       seluruh gaya + animasi (CSS murni)
assets/app.js           i18n, preloader, drawer, typewriter, form, efek biner
assets/arfhacom_logo.svg
                        logo utama (header, preloader, footer)
assets/binary-pattern*.svg
                        tekstur biner latar banner (putih redup & hijau LED)
assets/client-*.png, assets/client-tcg.svg, assets/mignon-sista.png
                        logo klien — disimpan lokal, sengaja tidak menaut ke domain luar
assets/og-image.png     1200x630 untuk pratinjau bagikan (OG/Twitter)
assets/apple-touch-icon.png
robots.txt, sitemap.xml, security.txt, .well-known/security.txt
_headers                tajuk keamanan untuk host yang mendukungnya (mis. Netlify)
CNAME                   arfha.com (untuk GitHub Pages)
```

## Menjalankan lokal

```bash
python3 -m http.server 8000      # lalu buka http://127.0.0.1:8000/
```

Tidak ada langkah build. Karena `content/` diambil lewat fetch, buka lewat server (bukan `file://`).

## Catatan

- Bahasa: Inggris, Indonesia, Arab (RTL), Prancis, Spanyol, Rusia. Tombol bahasa di kanan atas.
- Kontak form membuka aplikasi email pengunjung (`mailto:`) dengan isi pesan sudah terisi.
  Protokol `mailto:` tidak dapat menetapkan pengirim, jadi alamat pengirim mengikuti akun
  yang aktif di aplikasi email pengunjung.
- Logo klien berhak milik masing-masing pemilik merek dan hanya dipakai sebagai rujukan
  portofolio pekerjaan.
- Semua aset dilayani dari domain ini sendiri; tidak ada permintaan ke domain pihak ketiga.

## Lisensi

Kode dan desain: © Arfhacorp. Logo dan merek klien tetap milik pemiliknya masing-masing.
