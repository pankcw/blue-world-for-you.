# 💙 Blue World For You

Website hadiah digital interaktif (HTML + CSS + JavaScript murni, tanpa backend).
Password: `25 juli` (huruf kecil, pakai spasi).

## Struktur
```
blue-world-for-you/
├── assets/ (images, music, sounds)
├── index.html
├── README.md
├── script.js
└── style.css
```

## Mengganti foto
Taruh foto kamu di `assets/images/` dengan nama `foto1.jpg` sampai `foto12.jpg` (timpa file lama). Disarankan rasio 4:5 (potret), ukuran maks ±300 KB per foto agar cepat dibuka. Caption foto ada di `script.js`, bagian `const CAP=[...]`.

## Memasukkan musik
Timpa `assets/music/background.mp3` dengan lagu instrumental pilihanmu (nama file harus sama). Musik baru mulai setelah password benar (aturan autoplay browser).

## Mengganti efek suara
Timpa file di `assets/sounds/` dengan nama yang sama: `click.mp3`, `success.mp3`, `pop.mp3`, `open-letter.mp3`, `wrong.mp3`. Bawaan berupa nada sederhana buatan kode; ganti kalau mau yang lebih bagus.

## Mengedit teks
- Halaman utama, galeri, surat, penutup: buka `index.html`, cari teksnya lalu ubah.
- Teks ucapan yang muncul bertahap: `script.js`, bagian `const WL=[...]`.
- Pertanyaan kuis: `const Q=[...]` (jawaban benar selalu item pertama di `o`; urutan diacak otomatis).
- Pesan amplop: `const MSG=[...]`.

## Mengganti password
Di `script.js`, ubah `const PASS='25 juli';`. Ubah juga petunjuk di `index.html` (bagian "Petunjuk kecil") dan pengecekan `'25juli'` di fungsi `tryPass` jika perlu.

## Menjalankan secara lokal
Cara mudah: klik dua kali `index.html`. Atau pakai server lokal: `python -m http.server 8000` lalu buka `http://localhost:8000`.

## Upload ke GitHub & aktifkan GitHub Pages
1. Buat akun di github.com, klik **New repository**, beri nama (mis. `hadiah-untukmu`), pilih Public.
2. Klik **uploading an existing file**, lalu upload **isi** folder (index.html, script.js, style.css, folder assets), bukan ZIP-nya. Klik **Commit changes**.
3. Buka **Settings → Pages**. Di *Branch* pilih `main` dan folder `/ (root)`, klik **Save**.
4. Tunggu 1–3 menit, link muncul: `https://username.github.io/nama-repo/`.

Tips: nama file di GitHub Pages membedakan huruf besar/kecil (`foto1.jpg` ≠ `Foto1.JPG`).
