// Import modul yang dibutuhkan
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Inisialisasi aplikasi Express
const app = express();

// Konfigurasi koneksi ke MongoDB
var mongoURL = "mongodb+srv://kawakibi2802:kawakibi2802@cluster0.rbua9m8.mongodb.net/kawakibidb";
mongoose.connect(mongoURL);

// Mendapatkan objek koneksi aktif ke MongoDB
var connection = mongoose.connection;

// Event listener untuk menangani error pada koneksi MongoDB
connection.on("error", () => {
  console.log("Mongo DB Connection Failed");
});

// Event listener untuk menangani koneksi berhasil pada MongoDB
connection.on("connected", () => {
  console.log("Mongo DB Connection Success");
});

// Mendefinisikan schema untuk data sensor menggunakan Mongoose
const sensortestSchema = new mongoose.Schema({
  suhu: Number,
  kelembaban: Number,
  NH3: Number,
});

// Membuat model SensorTest berdasarkan schema yang telah didefinisikan
const SensorTest = mongoose.model("SensorTest", sensortestSchema);

// Middleware untuk menghandle data yang masuk dalam format URL-encoded dan JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mengaktifkan CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Endpoint untuk menyimpan data sensor ke database
app.post("/kirimdatatest", async (req, res) => {
  const { suhu, kelembaban, NH3 } = req.body;

  // Membuat objek baru dari model SensorTest
  const newSensorTest = new SensorTest({
    suhu: suhu,
    kelembaban: kelembaban,
    NH3: NH3,
  });

  try {
    // Menyimpan data sensor ke MongoDB
    const result = await newSensorTest.save();
    console.log("Berhasil menyimpan data sensor test:", result);
    res.status(200).json({ message: "Berhasil menyimpan data sensor test" });
  } catch (err) {
    console.log("Gagal menyimpan data sensor:", err);
    res.status(500).json({ message: "Gagal menyimpan data sensor" });
  }
});

// Endpoint untuk mengambil data sensor dari database
app.get("/ambildatatest", async (req, res) => {
  try {
    // Mengambil semua data sensor dari MongoDB
    const data = await SensorTest.find({});
    console.log("Berhasil mengambil data sensor");
    res.status(200).json(data);
  } catch (err) {
    console.log("Gagal mengambil data sensor:", err);
    res.status(500).json({ message: "Gagal mengambil data sensor" });
  }
});

// Default endpoint untuk menunjukkan bahwa server berjalan dengan baik
app.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

// Menjalankan server pada port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
