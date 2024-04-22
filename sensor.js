// Import modul yang dibutuhkan
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Inisialisasi aplikasi Express
const app = express();

// Konfigurasi koneksi ke MongoDB
var mongoURL =
  "mongodb+srv://kawakibi2802:kawakibi2802@cluster0.rbua9m8.mongodb.net/kawakibidb";
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

// Mendefinisikan schema/tabel untuk data sensor menggunakan Mongoose
const kandangSapiSchema = new mongoose.Schema(
  {
    suhu: Number,
    kelembaban: Number,
    NH3: Number,
  },
  {
    timestamps: true,
  }
);

// Membuat model SensorTest berdasarkan schema yang telah didefinisikan
const KandangSapi = mongoose.model("KandangSapi", kandangSapiSchema);

// Middleware untuk menghandle data yang masuk dalam format URL-encoded dan JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mengaktifkan CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Endpoint untuk menyimpan data sensor ke database
app.post("/kirimKandangSapi", async (req, res) => {
  const { suhu, kelembaban, NH3 } = req.body;

  // Membuat objek baru dari model KandangSapi
  const newKandangSapi = new KandangSapi({
    suhu: suhu,
    kelembaban: kelembaban,
    NH3: NH3,
  });

  try {
    // Menyimpan data sensor ke MongoDB
    const result = await newKandangSapi.save();
    console.log("Berhasil menyimpan data Kandang Sapi test:", result);
    res.status(200).json({ message: "Berhasil menyimpan data Kandang Sapi" });
  } catch (err) {
    console.log("Gagal menyimpan data Kandang Sapi:", err);
    res.status(500).json({ message: "Gagal menyimpan data Kandang Sapi" });
  }
});

// Endpoint untuk mengambil data sensor kandang sapi dari database
app.get("/ambilDataKandangSapi", async (req, res) => {
  try {
    // Mengambil semua data sensor dari MongoDB
    const data = await KandangSapi.find({});
    console.log("Berhasil mengambil data Kandang Sapi");
    res.status(200).json(data);
  } catch (err) {
    console.log("Gagal mengambil data Kandang Sapi:", err);
    res.status(500).json({ message: "Gagal mengambil data Kandang Sapi" });
  }
});

// Mendefinisikan schema/tabel untuk data sensor menggunakan Mongoose
const sekitarKandangSapi = new mongoose.Schema(
  {
    NH3: Number,
  },
  {
    timestamps: true,
  }
);

// Membuat model SensorNH3 berdasarkan schema yang telah didefinisikan
const SekitarKandangSapi = mongoose.model(
  "SekitarKandangSapi",
  sekitarKandangSapi
);

// Endpoint untuk menyimpan data sensor NH3 ke database
app.post("/kirimSekitarKandangSapi", async (req, res) => {
  const { NH3 } = req.body;

  // Membuat objek baru dari model SensorNH3
  const sekitarKandangSapi = new SekitarKandangSapi({
    NH3: NH3,
  });

  try {
    // Menyimpan data sensor NH3 ke MongoDB
    const result = await sekitarKandangSapi.save();
    console.log("Berhasil menyimpan data sekitar kandang sapi:", result);
    res
      .status(200)
      .json({ message: "Berhasil menyimpan data sekitar kandang sapi" });
  } catch (err) {
    console.log("Gagal menyimpan data sekitar kandang sapi:", err);
    res
      .status(500)
      .json({ message: "Gagal menyimpan data sekitar kandang sapi" });
  }
});

// Endpoint untuk mengambil data sensor sekitar kandang sapi dari database
app.get("/ambilDataSekitarKandangSapi", async (req, res) => {
  try {
    // Mengambil semua data sensor dari MongoDB
    const data = await SekitarKandangSapi.find({});
    console.log("Berhasil mengambil data sekitar kandang sapi");
    res.status(200).json(data);
  } catch (err) {
    console.log("Gagal mengambil data sekitar kandang sapi:", err);
    res
      .status(500)
      .json({ message: "Gagal mengambil data sekitar kandang sapi" });
  }
});

app.get("/ambilDataDenganTanggalSekitarKandangSapi", async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    let query = {};

    if (startDate && endDate) {
      query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else if (startDate) {
      query = { createdAt: { $gte: new Date(startDate) } };
    } else if (endDate) {
      query = { createdAt: { $lte: new Date(endDate) } };
    }

    const data = await SekitarKandangSapi.find(query);
    console.log("Berhasil mengambil data sensor berdasarkan tanggal");
    res.status(200).json(data);
  } catch (err) {
    console.log("Gagal mengambil data sensor:", err);
    res.status(500).json({ message: "Gagal mengambil data sensor" });
  }
});

app.get("/ambilDataDenganTanggalKandangSapi", async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    let query = {};

    if (startDate && endDate) {
      query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else if (startDate) {
      query = { createdAt: { $gte: new Date(startDate) } };
    } else if (endDate) {
      query = { createdAt: { $lte: new Date(endDate) } };
    }

    const data = await KandangSapi.find(query);
    console.log("Berhasil mengambil data sensor berdasarkan tanggal");
    res.status(200).json(data);
  } catch (err) {
    console.log("Gagal mengambil data sensor:", err);
    res.status(500).json({ message: "Gagal mengambil data sensor" });
  }
});

// Auth

const authSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Auth = mongoose.model("users", authSchema);

app.post("/register", async (req, res) => {
  const newUser = new Auth({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const user = await newUser.save();
    console.log(user);
    res.send("User Register Sucesfuly");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Auth.findOne({ username: username });

    if (user) {
      if (user.password === password) {
        res.send(user);
      } else {
        return res.status(400).json({ message: "Wrong Password" });
      }
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await Auth.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ error });
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
// const port = 5000;
// app.listen(port, () => {
//   console.log(`Server berjalan di port ${port}`);
// });


app.use(cors());


app.listen(3000, () => {
  console.log("Server uinjek is running on port 3000");
});
