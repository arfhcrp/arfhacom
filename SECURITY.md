# Security Policy

## Melaporkan masalah keamanan

Kirim email ke **hello@arfhacorp.com** dengan subjek `SECURITY: arfha.com`.

Mohon sertakan langkah reproduksi dan dampaknya. Kami membalas dalam 3 hari kerja
dan akan memberi kabar saat perbaikan dirilis.

Harap jangan membuka issue publik untuk kerentanan yang belum diperbaiki.

## Cakupan

- https://arfha.com (situs statis) dan berkas yang dilayani dari domain ini.

## Yang kami terapkan

- Hanya HTTPS, tanpa sumber daya pihak ketiga, tanpa cookie, tanpa tracker, tanpa analitik.
- Tanpa `eval`, tanpa skrip inline, tanpa pustaka eksternal.
- Tajuk keamanan (CSP, nosniff, frame-ancestors, Permissions-Policy) pada host yang mendukung `_headers`.

## Keluar dari cakupan

- Domain pihak ketiga yang hanya ditautkan, bukan dihosting di sini.
