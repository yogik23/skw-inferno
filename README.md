# Inferium — Incentivized Testnet


### Fitur Autobot
- Multi Akun
- Register Akun (Reff tidak masuk atau terbaca, multi akun)
- Daily Check in
- Daily Quest
- Menyelesaikan Quest
- Notif ke Telegram

### [Link Testnet](https://www.inferium.io/#/referral?inviteCode=5IIBvhac)

### [Link Ubah Password ke hash](https://t.me/airdropxnxxbot)

### Step Running

**1. Clone repo dan masuk ke folder**
```
git clone https://github.com/yogik23/skw-inferno && cd skw-inferno
```

**2. Install Module**
```
npm install
```

**3. Submit email dan password di file** `config.json`
```
nano config.json
```
`Note : untuk config.json password harus diubah ke hash, jika login web password tetap biasa` \
format config.json 
```
[
  {
    "email": "email1",
    "password": "password"
  },
  {
    "email": "email2",
    "password": "password"
  },
  {
    "email": "email3",
    "password": "password"
  }
]
```
**4. Edit file `.env` untuk notif ke telegram**
```
nano .env
```
format `.emv`
```
TELEGRAM_BOT_TOKEN=ApiBot
TELEGRAM_CHAT_ID=userIDtelegram
```
**5. Jalankan bot** 
```
node main.js
```

### Step Register Akun
ABAIKAN Jika sudah melakukan Clone repo, masuk ke folder dan Install Module
```
git clone https://github.com/yogik23/skw-etherdrop && cd skw-etherdrop && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && source ~/.bashrc && nvm install v22.3.0 && nvm use v22.3.0 && nvm alias default v22.3.0 && npm i
```

**1. Submit email dan password di file** `data.json`
```
nano data.json
```
`Note : untuk data.json password harus diubah ke hash, jika login web password tetap biasa` \
format data.json 
```
[
    {
        "email": "email1",
        "password": "password",
        "confirmPassword": "password",
        "code": "disini",
        "inviteCode": "5IIBvhac"
    },
    {
        "email": "email2",
        "password": "password",
        "confirmPassword": "password",
        "code": "disini",
        "inviteCode": "5IIBvhac"
    },
    {
        "email": "email3",
        "password": "password",
        "confirmPassword": "password",
        "code": "disini",
        "inviteCode": "5IIBvhac"
    }
]
```
**2. Jalanakn `email.js` untuk mendapatkan OTP ( Kode expired dalam 10 Menit )**
```
node email.js
```
**3. Ambil OTP submit ke file `data.json` ubah bagian disini ke OTP yg didapat**

**4. Jalankan `register.js` untuk melanjutkan registrasi**
```
node register.js
```
**5. Jika berhasil Regsitrasi Email dan Password akan otomatis tersimpan dalam file `config.json` lalu jalankan Step Running tanpa mengedit `config.json` lagi** \
\
\
**Sodah kerjekan mun sian botnye**
