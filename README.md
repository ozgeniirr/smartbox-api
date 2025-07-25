# SmartBox API

SmartBox API, şehir genelinde kullanılan akıllı kargo dolaplarını (SmartBox) yönetmek için geliştirilmiş bir backend sistemidir.  
Kuryeler paketleri dolaplara bırakır, kullanıcılar ise QR kod ile dolaptan alım yapar.  
Bu sistem `TypeScript`, `Express.js` ve `PostgreSQL` kullanılarak geliştirilmiştir.

## Güvenlik

- Kullanıcı şifreleri, `bcryptjs` ile hashlenerek veritabanına kaydedilir.  
- Giriş esnasında şifre karşılaştırmaları yine bcrypt ile güvenli şekilde yapılır.  
- Kimlik doğrulama JSON Web Token (JWT) ile sağlanır.


## 🚀 Özellikler

- `JWT` tabanlı kullanıcı kayıt & giriş (authentication)
- Paket bırakma ve QR kod ile teslim alma
- SmartBox (akıllı dolap) CRUD işlemleri
- class-validator ile DTO kontrolü
- `PostgreSQL` veritabanı (TypeORM ile)
- Role kontrolü ve middleware desteği

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

> Not: PostgreSQL servisinizin çalıştığından emin olun.

---

## 📫 API Uç Noktaları

### 🛂 Authentication
- `POST /auth/register` – Kullanıcı kaydı
- `POST /auth/login` – Giriş + JWT token

### 👤 Users
- `GET /users/all` -Tüm kullanıcıları getirir
- `GET /users/profile/me` -Knedi profil bilgilerini getirir


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

```ts
## 👩‍💻 Geliştirici Notları

Proje içinde `types/express/index.d.ts` dosyası kullanılarak Express'in `Request` tipine `user` özelliği eklenmiştir.  
Bu sayede JWT doğrulama sonrası `req.user` üzerinden kullanıcı bilgisi tip güvenli şekilde erişilebilir.
// Örnek
req.user?.id


---

## 🧪 Postman ile Test

Tüm endpoint’leri test edebilmeniz için [smartbox-api.postman_collection.json](./smartbpx-api.postman_collection.json) dosyasını bu repoda bulabilirsiniz.

1. Postman'i açın,
2. "Import" tuşuna tıklayın
3. `smartbox-api.postman_collection.json` dosyasını seçin
4. İlgili token'ları ve parametreleri doldurarak test etmeye başlayın ✅

JWT gerektiren isteklerde `Authorization: Bearer <token>` başlığı eklenmelidir.


---

## 📁 Proje Yapısı 


src/
├── api/
│   ├── auth/
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

