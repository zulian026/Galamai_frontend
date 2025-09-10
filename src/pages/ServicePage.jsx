// src/pages/LayananSidebarPage.jsx
import React, { useState } from "react";
import heroBg from "../assets/images/hero-bg.png"; // ganti sesuai path gambarmu
import { FileDown, Search } from "lucide-react";

export default function LayananSidebarPage() {
  const [activeLayanan, setActiveLayanan] = useState("layanan1");
  const [searchTerm, setSearchTerm] = useState("");

  const layananList = [
    {
      id: "layanan1",
      title: "Pengaduan Masyarakat & Informasi Obat/Makanan",
      image: "layanan1.png",
      description:
        "Memberikan fasilitas pengaduan masyarakat dan informasi terkait obat dan makanan yang aman dan sesuai regulasi.",
      details: (
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Persyaratan */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              1. Persyaratan
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Identitas pemohon (nama, nomor
                telepon/WhatsApp/email/alamat/media sosial, pekerjaan/profesi,
                KTP/identitas lainnya untuk tatap muka)
              </li>
              <li>Jenis informasi yang dibutuhkan</li>
              <li>Tujuan permintaan informasi</li>
            </ul>
          </div>

          {/* Alur Layanan */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              2. Alur Layanan
            </h3>
            <p>
              Proses alur layanan sesuai ketentuan <b>BBPOM Padang</b>.
            </p>
          </div>

          {/* Sistem, Mekanisme, dan Prosedur */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              3. Sistem, Mekanisme, dan Prosedur
            </h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                Pemohon menyampaikan pengaduan/permintaan informasi dengan cara:
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <span className="font-medium">Langsung:</span>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <b>Kantor BBPOM Padang</b>, Jl. Gajah Mada Gunung
                        Pangilun
                        <br />
                        <span className="text-sm text-gray-600">
                          Senin–Kamis 08.00–16.30, Jumat 08.00–16.00
                        </span>
                      </li>
                      <li>
                        <b>MPP Plaza Andalas Padang</b>, Lantai IV
                        <br />
                        <span className="text-sm text-gray-600">
                          Senin & Kamis 08.00–16.00
                        </span>
                      </li>
                      <li>
                        <b>MPP Kota Pariaman</b>, Jl. Syekh Burhanuddin No.145
                        <br />
                        <span className="text-sm text-gray-600">
                          Minggu I & III, 08.00–16.00
                        </span>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Telepon/SMS/WhatsApp: <b>0851-1727-5330</b>
                  </li>
                  <li>
                    Subsite:{" "}
                    <a
                      href="https://padang.pom.go.id"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      https://padang.pom.go.id
                    </a>
                  </li>
                  <li>
                    Media Sosial:
                    <ul className="list-[lower-alpha] pl-6 space-y-1 mt-1">
                      <li>Instagram : @bpom.padang</li>
                      <li>X : @bbpompadang</li>
                      <li>Facebook : bpom.padang</li>
                      <li>TikTok : @bpom.padang</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>Petugas memverifikasi permohonan</li>
              <li>Petugas menindaklanjuti permohonan</li>
              <li>Pemohon menerima informasi sesuai permintaan</li>
            </ol>
          </div>

          {/* Jangka Waktu */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              4. Jangka Waktu Pelaksanaan
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Maksimal <b>5 hari kerja</b> sejak pemohon menyampaikan
                permintaan informasi
              </li>
              <li>
                Pengaduan <i>tanpa pemeriksaan lapangan</i>: ≤{" "}
                <b>14 hari kerja</b>
              </li>
              <li>
                Pengaduan <i>dengan pemeriksaan lapangan</i>: ≤{" "}
                <b>60 hari kerja</b>
              </li>
            </ul>
          </div>

          {/* Biaya */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              5. Biaya/Tarif
            </h3>
            <p>
              <span className="font-bold text-green-600">Gratis</span> (tidak
              dikenakan biaya).
            </p>
          </div>

          {/* Konsultasi */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              6. Konsultasi WhatsApp Layanan
            </h3>
            <p>
              Konsultasi dapat disampaikan melalui WhatsApp Layanan:{" "}
              <span className="font-bold">0851-1727-5330</span>
            </p>
          </div>

          {/* CTA Pengaduan */}
          <div className="pt-6 border-t">
            <p className="mb-3 text-gray-800 font-medium">
              Ingin melakukan pengaduan? Silahkan klik tombol di bawah ini:
            </p>
            <a
              href="/layanan/pengaduan"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-header text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Ajukan Pengaduan
            </a>
          </div>
        </div>
      ),
    },
    {
      id: "layanan2",
      title: "Layanan Pengujian Obat & Makanan (Sampel dari Pihak ke-3)",
      image: "Picture1.png",
      description:
        "Menyediakan layanan pengujian sampel obat dan makanan dari pihak ketiga untuk memastikan keamanan dan kualitas produk.",
      details: (
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Persyaratan */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              1. Persyaratan
            </h3>
            <ol className="list-[lower-alpha] pl-6 space-y-2">
              <li>
                Identitas pemohon:
                <ul className="list-disc pl-6 space-y-1">
                  <li>KTP</li>
                  <li>NPWP Instansi/Perusahaan</li>
                  <li>Nomor HP/Telepon/Email/Alamat</li>
                  <li>Pekerjaan/profesi</li>
                </ul>
              </li>
              <li>
                Dokumen administrasi permohonan pengujian sampel obat dan
                makanan pihak ketiga:
                <ol className="list-decimal pl-6 space-y-1 mt-2">
                  <li>Nama instansi/perusahaan, alamat, nomor telepon</li>
                  <li>Tujuan pengujian</li>
                  <li>Data dan identitas sampel</li>
                  <li>Nama sampel</li>
                  <li>Jenis sampel</li>
                  <li>Nomor batch dan/atau pendaftaran sampel</li>
                  <li>Jumlah dalam satuan atau berat sampel</li>
                  <li>Kemasan penyimpanan sampel</li>
                  <li>Parameter uji sampel</li>
                  <li>
                    Untuk permintaan uji sampel Nappza dari kepolisian wajib
                    melampirkan:
                    <ol className="list-[lower-alpha] pl-6 space-y-1 mt-1">
                      <li>Surat Pengantar Permohonan Uji</li>
                      <li>Surat Perintah Tugas</li>
                      <li>Surat Perintah Penyidikan</li>
                      <li>Laporan Polisi</li>
                      <li>Surat Perintah Penyelidikan</li>
                      <li>Berita Acara Penyitaan</li>
                      <li>Surat Perintah Penyisihan Barang Bukti</li>
                      <li>Berita Acara Penyisihan Barang Bukti</li>
                      <li>Surat Pemberitahuan Dimulainya Penyidikan</li>
                      <li>Sampel dilengkapi segel dan label</li>
                      <li>
                        Berita acara penimbangan (Pegadaian/instansi berwenang)
                      </li>
                    </ol>
                  </li>
                  <li>
                    Untuk permintaan uji dari perorangan/industri wajib
                    menyampaikan tujuan pengujian dengan surat pernyataan
                    pengujian.
                  </li>
                </ol>
              </li>
            </ol>
          </div>

          {/* Alur Layanan */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              2. Alur Layanan
            </h3>
            <p>
              Pelayanan pengujian sampel obat dan makanan pihak ketiga
              menggunakan <b>Portal SIPT Pihak Ke-3</b> yang dapat diakses
              melalui{" "}
              <a
                href="https://sipt.pom.go.id/pihak-3/login"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                https://sipt.pom.go.id/pihak-3/login
              </a>{" "}
              atau melalui pencarian "SIPT BPOM Pihak Ke-3".
            </p>
          </div>

          {/* Sistem, Mekanisme, dan Prosedur */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              3. Sistem, Mekanisme, dan Prosedur
            </h3>
            <ol className="list-[lower-alpha] pl-6 space-y-2">
              <li>
                Pemohon membuat akun di Portal SIPT Pihak Ke-3 dan mengisi data.
              </li>
              <li>
                Pemohon mengajukan permohonan uji sampel pada Portal SIPT Pihak
                Ke-3.
              </li>
              <li>Petugas memeriksa kelengkapan berkas permohonan & sampel.</li>
              <li>
                Petugas membuat kaji ulang permintaan & kontrak pengujian
                (ISO/IEC 17025:2017).
              </li>
              <li>
                Petugas membuat kode billing → pemohon melakukan pembayaran.
              </li>
              <li>Pemohon menyerahkan bukti pembayaran ke petugas.</li>
              <li>
                Petugas membuat BAST sampel uji → ditandatangani pemohon &
                petugas.
              </li>
              <li>
                Petugas membuat SPU & meneruskan ke Manajer Teknis (MT), lalu
                sampel dikirim ke laboratorium.
              </li>
              <li>MT membuat Surat Perintah Kerja (SPK) untuk penyelia.</li>
              <li>
                Penyelia membuat Surat Perintah Pengujian (SPP) untuk penguji.
              </li>
              <li>Penguji melakukan pengujian & input hasil uji ke portal.</li>
              <li>Penyelia melakukan verifikasi Catatan Pengujian.</li>
              <li>
                MT melakukan verifikasi LHU & generate TTE laporan/sertifikat
                hasil uji & surat sisa hasil uji.
              </li>
              <li>
                Petugas membuat SPU & BAST sisa sampel → dikirim ke Kepala BBPOM
                Padang.
              </li>
              <li>
                Kepala BBPOM Padang generate TTE surat pengantar & surat
                keterangan sisa uji.
              </li>
              <li>Pemohon menerima & download laporan pengujian via portal.</li>
            </ol>
          </div>

          {/* Jangka Waktu */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              4. Jangka Waktu Pelaksanaan
            </h3>
            <p>
              Sesuai jenis uji yang dilakukan, dengan ketentuan waktu maksimal
              berbeda per parameter.
            </p>
          </div>

          {/* Biaya / Tarif */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              5. Biaya/Tarif
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">No</th>
                    <th className="border px-3 py-2">Jenis Pelayanan</th>
                    <th className="border px-3 py-2">Biaya Uji (Rp)</th>
                    <th className="border px-3 py-2">Waktu (Hari Kerja)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-3 py-2">1</td>
                    <td className="border px-3 py-2">Ganja</td>
                    <td className="border px-3 py-2">511.185</td>
                    <td className="border px-3 py-2">3</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">2</td>
                    <td className="border px-3 py-2">Shabu</td>
                    <td className="border px-3 py-2">1.243.177</td>
                    <td className="border px-3 py-2">4</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">3</td>
                    <td className="border px-3 py-2">Ekstasi</td>
                    <td className="border px-3 py-2">2.716.960</td>
                    <td className="border px-3 py-2">5</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">4</td>
                    <td className="border px-3 py-2">Borax</td>
                    <td className="border px-3 py-2">90.190</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">5</td>
                    <td className="border px-3 py-2">Formalin</td>
                    <td className="border px-3 py-2">353.330</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">6</td>
                    <td className="border px-3 py-2">Rhodamin B, Nitrit</td>
                    <td className="border px-3 py-2">1.155.264</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">7</td>
                    <td className="border px-3 py-2">Cemaran Pb, As, Cd, Sn</td>
                    <td className="border px-3 py-2">963.299</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">8</td>
                    <td className="border px-3 py-2">Sakarin</td>
                    <td className="border px-3 py-2">882.554</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">9</td>
                    <td className="border px-3 py-2">Sulfit</td>
                    <td className="border px-3 py-2">735.500</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">10</td>
                    <td className="border px-3 py-2">Sorbat, Benzoat</td>
                    <td className="border px-3 py-2">882.554</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">11</td>
                    <td className="border px-3 py-2">Siklamat</td>
                    <td className="border px-3 py-2">1.274.569</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">12</td>
                    <td className="border px-3 py-2">Methanyl Yellow</td>
                    <td className="border px-3 py-2">420.995</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">13</td>
                    <td className="border px-3 py-2">FFA (Asam Lemak Bebas)</td>
                    <td className="border px-3 py-2">332.522</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">14</td>
                    <td className="border px-3 py-2">
                      Bilangan Peroksida (H2O2)
                    </td>
                    <td className="border px-3 py-2">332.522</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">15</td>
                    <td className="border px-3 py-2">Uji pH dengan pH Meter</td>
                    <td className="border px-3 py-2">113.278</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">16</td>
                    <td className="border px-3 py-2">Histamin</td>
                    <td className="border px-3 py-2">452.252</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">17</td>
                    <td className="border px-3 py-2">Kadar Air</td>
                    <td className="border px-3 py-2">196.201</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">18</td>
                    <td className="border px-3 py-2">Enzim Diastase</td>
                    <td className="border px-3 py-2">763.249</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">19</td>
                    <td className="border px-3 py-2">Coffein</td>
                    <td className="border px-3 py-2">882.554</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">20</td>
                    <td className="border px-3 py-2">MPN E. coli</td>
                    <td className="border px-3 py-2">1.642.350</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">21</td>
                    <td className="border px-3 py-2">Escherichia coli</td>
                    <td className="border px-3 py-2">1.154.627</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">22</td>
                    <td className="border px-3 py-2">Salmonella</td>
                    <td className="border px-3 py-2">1.642.350</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">23</td>
                    <td className="border px-3 py-2">Staphylococcus aureus</td>
                    <td className="border px-3 py-2">1.154.627</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">24</td>
                    <td className="border px-3 py-2">Kapang Khamir</td>
                    <td className="border px-3 py-2">1.154.627</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">25</td>
                    <td className="border px-3 py-2">Enterobacteriaceae</td>
                    <td className="border px-3 py-2">1.154.627</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">26</td>
                    <td className="border px-3 py-2">Bacillus cereus</td>
                    <td className="border px-3 py-2">1.154.627</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">27</td>
                    <td className="border px-3 py-2">Angka Lempeng Total</td>
                    <td className="border px-3 py-2">1.154.627</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">28</td>
                    <td className="border px-3 py-2">
                      Uji Raksa dengan Mercury Analyzer
                    </td>
                    <td className="border px-3 py-2">421.202</td>
                    <td className="border px-3 py-2">15</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-gray-600">
              <li>Untuk uji yang belum ada, silakan konfirmasi ke Petugas.</li>
              <li>
                Waktu penyelesaian dapat melebihi ketetapan jika terjadi
                kerusakan alat, ketidaktersediaan reagen/media, atau saat
                laboratorium melaksanakan program lain (uji profesiensi, uji
                banding, pelatihan, dll).
              </li>
              <li>Tarif mengacu pada PMK No.73/2024 tentang PNBP di BPOM.</li>
            </ul>
          </div>

          {/* Konsultasi */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-header">
              6. Konsultasi WhatsApp Layanan
            </h3>
            <p>
              Konsultasi dapat disampaikan melalui WhatsApp Layanan:{" "}
              <span className="font-bold">0851-1721-5331</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "layanan3",
      title: "Layanan Penerbitan Surat Keterangan Ekspor (SKE)",
      description:
        "Membantu penerbitan Surat Keterangan Ekspor untuk produk obat, makanan, dan kosmetika sesuai peraturan yang berlaku.",
    },
    {
      id: "layanan4",
      title: "Layanan Penerbitan Surat Keterangan Impor (SKI)",
      description:
        "Memberikan layanan penerbitan Surat Keterangan Impor guna mempermudah proses impor produk obat dan makanan.",
    },
    {
      id: "layanan5",
      title:
        "Layanan Penerbitan Hasil Pemeriksaan Pedagang Besar Farmasi (PBF) & Evaluasi CAPA dalam Rangka Sertifikasi CDOB",
      description:
        "Penerbitan hasil pemeriksaan dan evaluasi CAPA untuk mendukung sertifikasi CDOB bagi pedagang besar farmasi.",
    },
    {
      id: "layanan6",
      title:
        "Layanan Penerbitan Rekomendasi Pemenuhan Aspek CPOTB (CPO Tradisional yang Baik)",
      description:
        "Memberikan rekomendasi bertahap untuk pemenuhan aspek CPOTB pada produksi obat tradisional.",
    },
    {
      id: "layanan7",
      title:
        "Layanan Penerbitan Rekomendasi Pemenuhan Aspek CPKB (Kosmetika yang Baik)",
      description:
        "Memberikan rekomendasi terkait pemenuhan aspek CPKB bagi produsen kosmetika.",
    },
    {
      id: "layanan8",
      title:
        "Layanan Penerbitan Rekomendasi Sebagai Pemohon Notifikasi Kosmetika",
      description:
        "Menyediakan layanan penerbitan rekomendasi untuk pemohon notifikasi kosmetika agar sesuai regulasi.",
    },
    {
      id: "layanan9",
      title:
        "Layanan Penerbitan Sertifikat/Rekomendasi Izin Penerapan CPPOB (Pangan Olahan)",
      description:
        "Memberikan sertifikat dan rekomendasi untuk penerapan CPPOB dalam produksi pangan olahan.",
    },
  ];

  const filteredLayanan = layananList.filter(
    (layanan) =>
      layanan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layanan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeLayananData = layananList.find((l) => l.id === activeLayanan);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section>
        <div
          className="relative h-64 md:h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Layanan</h1>
            <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-90">
              Jelajahi layanan kami dan pilih untuk melihat deskripsi lengkap.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Kiri */}
        <div className="md:w-1/3 bg-white rounded-xl shadow-md p-4 flex flex-col gap-4 max-h-[80vh]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari layanan..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-header"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* List Layanan */}
          <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {filteredLayanan.length > 0 ? (
              filteredLayanan.map((layanan) => (
                <button
                  key={layanan.id}
                  onClick={() => setActiveLayanan(layanan.id)}
                  className={`text-left px-4 py-3 rounded-lg transition-all whitespace-normal break-words ${
                    activeLayanan === layanan.id
                      ? "bg-header text-white font-semibold shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {layanan.title}
                </button>
              ))
            ) : (
              <p className="text-gray-500 p-2">
                Tidak ada layanan yang sesuai.
              </p>
            )}
          </div>
        </div>

        {/* Deskripsi Kanan */}
        <div className="md:w-2/3 bg-white shadow-md rounded-xl p-6">
          {activeLayananData ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-header">
                {activeLayananData.title}
              </h2>

              {/* Tambahkan foto di bawah judul */}
              {activeLayananData.image && (
                <img
                  src={activeLayananData.image}
                  alt={activeLayananData.title}
                  className="max-w-full h-auto rounded-lg mb-6 shadow"
                />
              )}

              {activeLayananData.details ? (
                <div className="prose max-w-none">
                  {activeLayananData.details}
                </div>
              ) : (
                <p className="text-gray-700 mb-6">
                  {activeLayananData.description}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">
              Pilih layanan untuk melihat deskripsi lengkap.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
