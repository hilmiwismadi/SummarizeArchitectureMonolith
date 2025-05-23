# 📌 Modul 5: Integrasi React JS dengan Model AI untuk Ringkasan

## 🎯 Tujuan Pertemuan

Pada pertemuan ke-5 ini, peserta akan:

- Memahami konsep integrasi API dalam aplikasi React.
- Menghubungkan aplikasi React dengan model AI (DeepSeek, Google, Meta) menggunakan API OpenRouter.
- Menampilkan hasil ringkasan yang dihasilkan oleh model AI di aplikasi React.

---

## API Integration

### Apa itu API?

API (Application Programming Interface) adalah antarmuka yang memungkinkan komunikasi antara dua aplikasi berbeda, biasanya untuk mengakses data atau layanan eksternal.

---

## 📌 Konsep Asynchronous & Synchronous di React

Secara default, **fungsi di React bersifat synchronous**. Artinya, eksekusi kode akan berjalan baris demi baris secara berurutan. Namun, saat kita berinteraksi dengan **API**, prosesnya menjadi **asynchronous** karena membutuhkan waktu (misalnya: fetch data dari server), sehingga React menggunakan **Promises** dan **async/await** untuk menunggu hasilnya tanpa menghentikan eksekusi kode lainnya.

### Penjelasan Promises & Async/Await

- Promises adalah objek yang merepresentasikan hasil operasi asynchronous. Statusnya bisa:

  > **Pending:** sedang diproses
  > **Fulfilled:** berhasil
  > **Rejected:** gagal

  ```javascript
  const promise = new Promise((resolve, reject) => {
    // operasi asynchronous
  });
  ```

- **Async/Await**

  > `async` digunakan untuk mendefinisikan fungsi asynchronous.  
  > `await` digunakan untuk menunggu hasil Promise sebelum melanjutkan eksekusi kode berikutnya.

  ```javascript
  const getData = async () => {
    try {
      const response = await fetch("https://api.example.com/data");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  ```

## 📌 Try-Catch-Finally

**Try-Catch-Finally** adalah blok untuk menangani error:

- **try:** blok utama untuk menjalankan kode.
- **catch:** menangkap error jika terjadi.
- **finally:** selalu dijalankan, baik sukses maupun gagal.

Contoh:

```javascript
const fetchData = async () => {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Terjadi error:", error);
  } finally {
    console.log("Request selesai");
  }
};
```

### Penggunaan file `.env`

File `.env` digunakan untuk menyimpan variabel lingkungan atau konfigurasi yang bersifat rahasia seperti API key. Variabel dalam file ini bisa diakses di aplikasi React dengan awalan `VITE_` (jika menggunakan Vite), misalnya:

```
VITE_OPENROUTER_API_KEY=your_api_key_here
```

Kemudian dapat diakses dalam kode JavaScript dengan cara:

```jsx
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
```

---

## Pengenalan OpenRouter

**OpenRouter** adalah platform aggregator yang menyediakan akses ke berbagai model AI dari banyak vendor (OpenAI, Google, Meta, Mistral, DeepSeek, dsb.) melalui satu API. OpenRouter memungkinkan pengguna menggunakan model-model AI secara gratis (untuk limit tertentu) atau berbayar.

Keuntungan bagi OpenRouter:

- Mendapatkan komisi transaksi saat pengguna membayar model tertentu.
- Memberikan layanan API terpadu agar pengguna tidak perlu mengatur API masing-masing vendor.

---

## Mendapatkan API Key dari OpenRouter

Ikuti langkah berikut untuk mendapatkan API Key dari OpenRouter:

1. Kunjungi situs [OpenRouter](https://openrouter.ai/) dan daftar atau masuk ke akun Anda.
2. Setelah login, buka halaman Dashboard API Keys.
3. Klik tombol **Create new API Key**.
4. Salin dan simpan API key tersebut, yang akan digunakan untuk mengakses model AI.

---

## Referensi Model AI OpenRouter

Kamu bisa melihat daftar lengkap model AI yang tersedia di OpenRouter di:

🔗 [https://openrouter.ai/models](https://openrouter.ai/models)

Beberapa model AI populer dan gratis untuk summarization:

| Vendor   | Model                        | Deskripsi Singkat                                          |
| -------- | ---------------------------- | ---------------------------------------------------------- |
| DeepSeek | `deepseek-chat`              | Model chat general-purpose dari DeepSeek                   |
| Google   | `gemini-pro`                 | Model dari Google Gemini untuk reasoning dan summarization |
| Meta     | `meta-llama/llama-2-7b-chat` | Model open-source dari Meta (Llama2)                       |

---

## Quickstart API OpenRouter

Panduan resmi untuk penggunaan API OpenRouter dapat dibaca di:

🔗 [https://openrouter.ai/docs/quickstart](https://openrouter.ai/docs/quickstart)

---

## 📌 Instalasi React Markdown

Hasil ringkasan dari model AI umumnya berbentuk **Markdown**. Untuk menampilkannya secara rapi di React, kita gunakan paket `react-markdown`.

### Instalasi

```bash
npm install react-markdown
```

### Penggunaan

Pada file komponen:

```jsx
import ReactMarkdown from "react-markdown";

<ReactMarkdown>{summary}</ReactMarkdown>;
```

---

## Tambah State untuk Menyimpan List Model AI dan Efek Loading

```jsx
const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324:free");
const [loading, setLoading] = useState(false);
```

## Modifikasi Komponen Summarizer.jsx dengan Parameter Model AI

Tambahkan UI dropdown untuk memilih model AI gratis dari vendor berbeda:

```jsx
import ReactMarkdown from "react-markdown";

const Summarizer = ({
  inputText,
  setInputText,
  summary,
  handleSummarize,
  handleReset,
  model,
  setModel,
  loading,
}) => {
  return (
    <>
      <p className="mb-4 text-lg">Masukkan teks untuk diringkas:</p>
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="deepseek/deepseek-chat-v3-0324:free">DeepSeek V3</option>
        <option value="meta-llama/llama-3.3-70b-instruct:free">
          Llama 3.3 70B Instruct (Meta)
        </option>
        <option value="google/gemini-2.0-flash-exp:free">
          Gemini Flash 2.0 Experimental (Google)
        </option>
      </select>
      // other tag
    </>
  );
};

export default Summarizer;
```

## Koneksi ke Model AI

```jsx
const handleSummarize = async () => {
  if (inputText.trim() === "") return;

  setSummary("");
  setLoading(true);
  // Kirim teks ke API untuk diringkas
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: `Summarize the following text without any addition answer. Answer in the language the user speaks:\n${inputText}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    setSummary(data.choices[0].message.content);
    const newHistory = [...history, data.choices[0].message.content];
    setHistory(newHistory);
    localStorage.setItem("summaryHistory", JSON.stringify(newHistory));
  } catch (error) {
    console.error("Gagal mengambil data ringkasan:", error);
  } finally {
    setLoading(false);
  }
};
```

## Animasi Loading

Tambahkan animasi loading untuk menunggu jawaban model AI

```html
<div className="text-gray-700">
  {summary ? (
  <ReactMarkdown>{summary}</ReactMarkdown>
  ) : loading ? (
  <div className="flex items-center justify-center py-4">
    <div
      className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
    ></div>
    <span className="ml-3">Memproses ringkasan...</span>
  </div>
  ) : ( "Hasil ringkasan teks akan muncul di sini setelah proses ringkasan
  selesai." )}
</div>
```

---

## 🚀 Deployment Aplikasi React

### Apa itu Deployment?

Deployment adalah proses untuk mempublikasikan aplikasi kita agar bisa diakses secara online oleh siapa saja. Setelah aplikasi selesai dibuat dan diuji coba secara lokal, langkah berikutnya adalah melakukan deployment agar aplikasi dapat digunakan oleh pengguna secara luas melalui internet.

---

## 🌐 Pengenalan Vercel

**Vercel** adalah platform hosting modern yang dirancang khusus untuk aplikasi frontend seperti React, Next.js, Vue, dan lain-lain. Kelebihan Vercel antara lain:

- Gratis untuk penggunaan standar.
- Deployment mudah melalui integrasi dengan GitHub, GitLab, atau Bitbucket.
- Cepat dan scalable, dengan CDN otomatis.
- Mendukung HTTPS otomatis untuk keamanan aplikasi.
- Mendukung continuous deployment (deploy otomatis setiap kali kode berubah di repository).

---

## 🔧 Langkah-langkah Deployment ke Vercel

Berikut langkah-langkah mudah untuk deploy aplikasi React kamu ke Vercel:

### 1. Push Project ke GitHub

- Pilih repository mu di [GitHub](https://github.com/).
- Push kode aplikasi React kamu ke repository tersebut.

### 2. Login ke Vercel

- Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub kamu.

### 3. Import Project

- Klik tombol **Add New** → **Project**.
- Pilih repository GitHub yang sudah kamu buat sebelumnya.

### 4. Konfigurasi Project

- Pada bagian **Configure Project**, Vercel secara otomatis mendeteksi React dan menyesuaikan pengaturan yang diperlukan.
- Pastikan build command: `npm run build` dan output directory: `dist` 

### 5. Variabel Lingkungan (Environment Variables)

- Tambahkan variabel lingkungan (Environment Variables) jika kamu menggunakan file `.env` di project-mu, misalnya:

| Key                     | Value          |
| ----------------------- | -------------- |
| VITE_OPENROUTER_API_KEY | `API_KEY_KAMU` |

- Klik **Environment Variables** lalu isi key dan value-nya sesuai yang dibutuhkan aplikasi.

### 6. Deploy Project

- Klik tombol **Deploy** untuk memulai proses deployment.
- Tunggu beberapa menit hingga deployment selesai.

### 7. Aplikasi Siap Diakses

- Setelah proses deployment berhasil, kamu akan mendapatkan URL yang bisa langsung dibuka di browser.
- Aplikasi React kamu kini sudah online dan bisa diakses siapa saja.

---

## 📝 Deployment Berkelanjutan (Continuous Deployment)

Setiap kali kamu push perubahan ke repository GitHub, Vercel akan otomatis melakukan deployment ulang. Ini mempermudah kamu mengelola versi terbaru dari aplikasi secara real-time.

---

## 🎉 Kesimpulan

Dengan melakukan deployment ke Vercel, aplikasi React yang sudah kamu buat bisa diakses oleh siapa saja melalui internet secara mudah, cepat, dan aman.

Sekarang, aplikasi AI Summarizer kamu sudah online dan siap digunakan! 🎯🚀
