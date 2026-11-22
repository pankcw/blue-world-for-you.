# A Little Blue World Just For You 💙

Hadiah digital interaktif untuk merayakan penampilan tari di acara Hari Guru. Website ini dibuat dengan HTML, CSS, dan JavaScript vanilla, tanpa backend atau database.

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser untuk mencoba website.
3. Password masuk: **25 juli** (huruf besar/kecil tidak berpengaruh; spasi di awal/akhir diabaikan).

## Mengganti foto
Buka folder `assets/images/`. Ganti file `foto1.jpg` sampai `foto6.jpg` dengan foto kalian.
- Pertahankan nama file yang sama agar tidak perlu mengubah kode.
- Gunakan format JPG/JPEG dan foto orientasi portrait atau square agar tampil rapi.
- File `placeholder.jpg` adalah gambar cadangan yang dipakai jika sebuah foto tidak tersedia atau gagal dimuat.
- Jangan hapus `placeholder.jpg`.

## Menambahkan musik
Salin file musik yang memang boleh kamu gunakan ke:
`assets/music/background.mp3`

Musik akan mulai dicoba setelah interaksi pertama yang berhasil (misalnya password benar), mengikuti aturan autoplay browser. Tombol Music di kanan atas dapat menyalakan/mematikan musik dan slider mengatur volume. Jika file tidak ada, website tetap berfungsi normal tanpa musik.

## Menambahkan sound effect (opsional)
Letakkan file MP3 di `assets/sounds/` dengan nama:
- `click.mp3`
- `success.mp3`
- `error.mp3`
- `complete.mp3`

Sound effect bersifat opsional. Jika belum ada, browser akan mengabaikannya dan fitur website tetap berjalan. ZIP ini sengaja tidak menyertakan audio kosong atau audio palsu.

## Mengubah isi website
- `index.html`: teks, urutan halaman, galeri, dan struktur game.
- `style.css`: warna, font, layout, animasi, dan responsive design.
- `script.js`: password, navigasi, musik, lightbox, kuis, game tangkap hati, puzzle, dan surat.

### Catatan mini games
- Kuis terdiri dari 5 pertanyaan mengenai perayaan ini dan konten website. Kamu bisa mengubah pertanyaan/jawaban pada array `questions` di `script.js`.
- Game Tangkap Hati berlangsung 20 detik.
- Puzzle adalah puzzle susun angka 1–8 dengan sistem ketuk dua ubin untuk menukar posisi. Tombol Acak lagi menghasilkan susunan yang tetap bisa diselesaikan.

## Deploy ke GitHub Pages
1. Login ke GitHub dan buat repository baru, misalnya `blue-world-for-you`.
2. Ekstrak ZIP di perangkatmu.
3. Upload **isi folder** `blue-world-for-you` (bukan folder luarnya saja) ke root repository. Pastikan `index.html` berada di root repository.
4. Buka **Settings → Pages**.
5. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
6. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
7. Tunggu proses deployment selesai. GitHub akan menampilkan URL website di bagian Pages.

Semua path aset menggunakan relative path sehingga cocok untuk GitHub Pages, termasuk repository project site.

## Privasi
Website berjalan di browser pengunjung. Password adalah gerbang sederhana di sisi klien, bukan sistem keamanan untuk informasi rahasia. Siapa pun yang memeriksa source code dapat menemukan logika password.
