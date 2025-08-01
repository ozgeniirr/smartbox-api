# SmartBox API

SmartBox API, şehir genelinde kullanılan akıllı kargo dolaplarını (SmartBox) yönetmek için geliştirilmiş bir backend sistemidir.  
Kuryeler paketleri dolaplara bırakır, kullanıcılar ise QR kod ile dolaptan alım yapar.  
Bu sistem `TypeScript`, `Express.js` ve `PostgreSQL` kullanılarak geliştirilmiştir.

## 🔐 Güvenlik

- Kullanıcı şifreleri `bcryptjs` ile hashlenerek veritabanına kaydedilir.  
- Giriş esnasında şifre karşılaştırmaları yine bcrypt ile güvenli şekilde yapılır.  
- Kimlik doğrulama JSON Web Token (JWT) ile sağlanır.

---

## 🚀 Özellikler

- `JWT` tabanlı kullanıcı kayıt & giriş (authentication)
- Paket bırakma ve QR kod ile teslim alma
- SmartBox (akıllı dolap) CRUD işlemleri
- class-validator ile DTO kontrolü
- `PostgreSQL` veritabanı (TypeORM ile)
- Role kontrolü ve middleware desteği

---

## 🧰 Kullanılan Teknolojiler

- `TypeScript & Node.js`
- `Express.js`
- `TypeORM`
- `PostgreSQL`
- `JWT (jsonwebtoken)`
- `bcryptjs`
- `class-validator / class-transformer`

---

## 🔧 Kurulum

1. Reponun klonlanması:
```bash
git clone https://github.com/ozgeniirr/smartbox-api.git
cd smartbox-api
```

2. Ortam değişkenlerinin ayarlanması:
```bash
cp .env.example .env
```

3. Bağımlılıkların yüklenmesi:
```bash
npm install
```

4. Uygulamanın başlatılması:
```bash
npm run start:dev
```
---

## 🐳 Docker ile Kullanım

Uygulamayı Docker kullanarak kolayca başlatabilirsiniz.

### 1. Docker ve Docker Compose yüklü olmalı  
- [Docker kurulumu](https://docs.docker.com/get-docker/)  
- [Docker Compose kurulumu](https://docs.docker.com/compose/install/)

### 2. Docker container'larını başlatma

```bash
docker-compose up --build
```

> Komut sonrası PostgreSQL, Redis ve Backend servisleri otomatik olarak başlatılır.

### 3. Container'ları durdurmak için

```bash
docker-compose down
```

### 📦 Docker Servisleri

- `backend`: Express + TypeScript backend (port: `3000`)
- `postgres`: Veritabanı servisi (port: `5432`)
- `redis`: OTP ve cache işlemleri için Redis (port: `6379`)

### ⚙️ Ortam Değişkenleri

`.env` dosyasında aşağıdaki örnek yapılandırmaları yapmalısınız:

```
PORT=3000
DATABASE_URL=postgres://postgres:yourpassword@postgres:5432/smartbox
JWT_SECRET=your_jwt_secret
REDIS_HOST=redis
REDIS_PORT=6379
```


---

## 📫 API Uç Noktaları

### 🛂 Authentication
- `POST /auth/register` – Kullanıcı kaydı
- `POST /auth/login` – Giriş + JWT token
- `POST /auth/verifyOtp` - Otp kodunun doğrulamasını yapıyor

### 👤 Users
- `GET /users/all` – Tüm kullanıcıları getirir  
- `GET /users/profile/me` – Kendi profil bilgilerini getirir
- `POST /email/send`- Otp doğrulaması için kod gönderir

### 📦 Package
- `POST /package` – Paket oluştur  
- `GET /package/:id` – Paket bilgisi getir  
- `PATCH /package/:id/pickup` – Paket teslim alındı olarak işaretle  
- `GET /package/me/qrcodes` – QR kodlarını getir

### 📮 SmartBox (Dolap)
- `GET /smartbox` – Tüm dolapları listele  
- `POST /smartbox` – Yeni dolap ekle  
- `PATCH /smartbox/:id` – Dolap güncelle  
- `DELETE /smartbox/:id` – Dolap sil

---

## 👩‍💻 Geliştirici Notları

Proje içinde `types/express/index.d.ts` dosyası kullanılarak Express'in `Request` tipine `user` özelliği eklenmiştir.  
Bu sayede JWT doğrulama sonrası `req.user` üzerinden kullanıcı bilgisi tip güvenli şekilde erişilebilir.

```
req.user?.id
```

---

## 🧪 Postman ile Test

Tüm endpoint’leri test edebilmeniz için `smartbox-api.postman_collection.json` dosyasını bu repoda bulabilirsiniz.

1. Postman'i açın  
2. "Import" tuşuna tıklayın  
3. `smartbox-api.postman_collection.json` dosyasını seçin  
4. İlgili token'ları ve parametreleri doldurarak test etmeye başlayın ✅

> JWT gerektiren isteklerde `Authorization: Bearer <token>` başlığı eklenmelidir.

---

## 📁 Proje Yapısı

```bash
src/
├── api/
│   ├── auth/
│   ├── email/
│   ├── users/
│   ├── packages/
│   └── smartboxes/
├── config/
├── dtos/
├── entities/
├── errors/
├── middlewares/
├── types/
├── utils/
├── server.ts
└── app.ts
```

---

##  Özellikler

### ✅ 1. QR Kod ile Paket Teslim Alma  
Kullanıcı artık kendine ait paketi QR kod girerek teslim alabilir.

#### `POST /packages/:packageId/pick`

**Body:**
```json
{
  "qrCode": "abc123xyz"
}
```

**Açıklama:**
- Paket sadece doğru QR kod gönderilirse teslim alınır.
- Teslim alındığında `isPickedUp = true` olur.
- Aynı paket tekrar alınamaz.

---

### ✅ 2. Kullanıcıya Ait QR Kodları Listeleme  
Kullanıcı, kendisine ait ve henüz teslim almadığı paketlerin QR kodlarını listeleyebilir.

#### `GET /users/me/qrcodes?page=1&limit=5`

**Response:**
```json
{
  "data": [
    {
      "qrCode": "abc123xyz",
      "content": "Kitap",
      "createdAt": "2025-08-01T..."
    }
  ],
  "totalItems": 3,
  "currentPage": 1,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```

---

### ✅ 3. Tüm Listeleme Uç Noktalarında Pagination Desteği  
Artık aşağıdaki endpoint’ler `?page=1&limit=5` gibi query parametreleriyle çalışır:

| Endpoint                          | Açıklama                          |
|----------------------------------|-----------------------------------|
| `GET /users/all`                 | Kullanıcıları listeler            |
| `GET /packages`                  | Tüm paketleri listeler            |
| `GET /smartbox`                  | Tüm dolapları listeler            |
| `GET /users/me/qrcodes`          | Kullanıcının QR kodlarını listeler|

**Pagination Response Formatı:**
```json
{
  "data": [/* veri */],
  "totalItems": 12,
  "currentPage": 1,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

### ✅ 4. OTP Güvenliği 
Sisteme sadece kayıt olurken girilen email'e OTP gönderilebilir.  
**Amaç:** Kullanıcının sistem dışı email adreslerine OTP göndererek spam oluşumunu engellemek.

---
