# dexa-be

Backend untuk technical test **Dexa Group**.
Menggunakan arsitektur **microservice** dengan 2 service utama:

* **hr-services** → berjalan di port `4001`
* **attendance-service** → berjalan di port `4002`

---

## ⚙️ Instalasi

1. Clone repository ini

   ```bash
   git clone <repo-url>
   cd dexa-be
   ```

2. Install dependencies untuk masing-masing service

   ```bash
   cd services/hr-services
   npm install

   cd ../attendance-service
   npm install
   ```

3. Pastikan file `.env` sudah dibuat di masing-masing folder service
   (ikuti contoh dari `.env.example`).

---

## ▶️ Menjalankan

Dari root project (`dexa-be/`), jalankan:

* Menjalankan **kedua service** sekaligus (mode development):

  ```bash
  npm run dev
  ```

* Menjalankan **hanya hr-services**:

  ```bash
  npm run dev:hr
  ```

* Menjalankan **hanya attendance-service**:

  ```bash
  npm run dev:attendance
  ```

* Menjalankan **kedua service** sekaligus (production):

  ```bash
  npm start
  ```

---

## 📝 Catatan

* Pastikan database sudah dijalankan dan environment tiap service di-setup dengan benar.
* **hr-services** digunakan untuk login dan manajemen data karyawan.
* **attendance-service** digunakan untuk absensi clock-in/clock-out.
* Frontend repo yang terhubung:

  * [DexaPeople](https://github.com/VigoMade/dexa-people.git)
  * [DexaWFH](https://github.com/VigoMade/dexa-wfh.git)

