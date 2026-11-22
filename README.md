# A Little Blue World Just For You 💙
Website hadiah digital interaktif (HTML + CSS + JavaScript murni, tanpa backend).

## Isi folder
```
index.html · style.css · script.js · README.md
assets/images/foto1.jpg … foto6.jpg
assets/music/background.mp3
assets/sounds/click.mp3 success.mp3 error.mp3 complete.mp3
```

## 1. Ganti foto
Timpa `foto1.jpg` … `foto6.jpg` di `assets/images/` dengan foto asli (nama persis sama, huruf kecil, ekstensi `.jpg`).
Disarankan rasio kotak/mendekati kotak dan ukuran < 500 KB per foto. Jika foto hilang, otomatis tampil placeholder (layout tidak rusak).

## 2. Musik
Taruh lagu pilihanmu sebagai `assets/music/background.mp3` (pakai lagu bebas hak cipta / milikmu sendiri). Musik mulai setelah layar pertama diketuk (aturan autoplay browser), tidak restart saat pindah halaman, dan ada tombol ON/OFF + volume di pojok kanan atas. Tanpa file ini, website tetap jalan normal.

## 3. Sound effect (opsional)
Tanpa file apa pun, efek suara dibuat otomatis lewat Web Audio (nada lembut). Jika ingin suara sendiri, taruh `click.mp3`, `success.mp3`, `error.mp3`, `complete.mp3` di `assets/sounds/` — otomatis dipakai.

## 4. Ubah teks / password
- Password ada di baris atas `script.js`: `const PASSWORD = '25 juli';` (huruf kecil).
- Pesan ada di `index.html` (cari teks, ganti langsung). Pertanyaan kuis ada di `script.js` (array `Q`), caption foto di array `caps`.

## 5. Deploy ke GitHub Pages
1. Buat repository baru di GitHub (mis. `blue-world-for-you`), set Public.
2. Upload SEMUA isi folder ini (file `index.html` harus ada di root repository).
3. Buka **Settings → Pages**. Di *Build and deployment*, pilih **Deploy from a branch**, branch **main**, folder **/(root)**, lalu **Save**.
4. Tunggu 1–3 menit. Link: `https://USERNAME.github.io/blue-world-for-you/`
5. Kirim link ke dia 💙 (buka di Chrome/Safari HP).

## Tips
- Semua path relatif, cocok untuk GitHub Pages. Font Google dimuat online (ada fallback jika gagal).
- Setelah mengganti foto/musik, bila tampilan lama masih muncul, refresh keras (Ctrl+Shift+R) atau buka tab penyamaran.
