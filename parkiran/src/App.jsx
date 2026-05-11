import "./App.css";

import React, { useEffect, useState } from "react";

import { Stage, Layer, Rect, Text } from "react-konva";

/* SLOT PARKIR */

const initialSlots = [
  { id: "A1" },
  { id: "A2" },
  { id: "A3" },
  { id: "A4" },
  { id: "B1" },
  { id: "B2" },
  { id: "B3" },
  { id: "B4" },
];

/* FORMAT DATETIME */

function formatDateTime(dateValue) {
  const date = new Date(dateValue);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}:${month}:${day} ${hours}:${minutes}`;
}

/* COUNTER */

function getRemainingTime(startTime, duration) {
  if (!startTime || !duration) return "";

  const start = new Date(startTime).getTime();

  const durationMs = parseInt(duration) * 60 * 60 * 1000;

  const end = start + durationMs;

  const now = new Date().getTime();

  const diff = end - now;

  if (diff <= 0) {
    return "Habis";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}j ${minutes}m ${seconds}d`;
}

/* APP */

function App() {
  const [openModal, setOpenModal] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState("");
  const [mapFilter, setMapFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    nama: "",
    kendaraan: "",
    durasi: "",
  });

  const [data, setData] = useState([
    {
      slot: "A2",
      nama: "Ibnu",
      kendaraan: "B 1234 CD",
      durasi: "2",

      mulai: formatDateTime(new Date()),

      selesai: formatDateTime(
        new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      ),

      startTime: new Date().toISOString(),

      endTime: new Date(
        new Date().getTime() + 2 * 60 * 60 * 1000,
      ).toISOString(),

      status: "danger",
    },

    {
      slot: "B3",
      nama: "Budi",
      kendaraan: "F 8899 ZZ",
      durasi: "0",

      mulai: formatDateTime(
        new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
      ),

      selesai: formatDateTime(
        new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
      ),

      startTime: new Date(
        new Date().getTime() - 2 * 60 * 60 * 1000,
      ).toISOString(),

      endTime: new Date(
        new Date().getTime() - 1 * 60 * 60 * 1000,
      ).toISOString(),

      status: "danger",
    },
  ]);

  /* SIMPAN */

  const handleSave = () => {
    if (!selectedSlot || !form.nama || !form.kendaraan || !form.durasi) {
      alert("Semua field wajib diisi");

      return;
    }

    const startDate = new Date();

    const endDate = new Date(
      startDate.getTime() + parseInt(form.durasi) * 60 * 60 * 1000,
    );

    const newData = {
      slot: selectedSlot,

      ...form,

      mulai: formatDateTime(startDate),

      selesai: formatDateTime(endDate),

      startTime: startDate.toISOString(),

      endTime: endDate.toISOString(),

      status: "danger",
    };

    setData([...data, newData]);

    setForm({
      nama: "",
      kendaraan: "",
      durasi: "",
    });

    setSelectedSlot("");

    setOpenModal(false);
  };

  /* SELESAI PARKIR */

  const handleFinishParking = (slot) => {
    const confirmFinish = window.confirm(
      `Apakah parkir slot ${slot} sudah selesai?`,
    );

    if (confirmFinish) {
      const filteredData = data.filter((item) => item.slot !== slot);

      setData(filteredData);
    }
  };

  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nama.toLowerCase().includes(keyword) ||
      item.kendaraan.toLowerCase().includes(keyword)
    );
  });

  /* SLOT TERSEDIA */

  const availableSlots = initialSlots.filter(
    (slot) => !data.find((d) => d.slot === slot.id),
  );

  return (
    <>
      <main className="main">
        {/* TOPBAR */}

        {/* TOPBAR */}

        <div className="topbar">
          <div></div>

          <div className="profile">
            <div>
              <strong>Admin</strong>

              <p
                style={{
                  fontSize: "12px",
                  color: "gray",
                }}
              >
                Administrator
              </p>
            </div>

            <img src="https://i.pravatar.cc/100" alt="profile" />
          </div>
        </div>

        {/* CARD */}

        <div className="cards">
          <div className="card blue">
            <h4>Total Slot</h4>

            <h2>{initialSlots.length}</h2>

            <p>Semua Kapasitas Parkir</p>

            <i className="fa-solid fa-square-parking"></i>
          </div>

          <div className="card green">
            <h4>Slot Tersedia</h4>

            <h2>
              {
                initialSlots.filter(
                  (slot) => !data.find((d) => d.slot === slot.id),
                ).length
              }
            </h2>

            <p>Siap Digunakan</p>

            <i className="fa-solid fa-circle-check"></i>
          </div>

          <div className="card red">
            <h4>Total Booking</h4>

            <h2>{data.length}</h2>

            <p>Sudah Dibooking</p>

            <i className="fa-solid fa-clock"></i>
          </div>

          <div className="card orange">
            <h4>Overtime</h4>

            <h2>
              {
                data.filter(
                  (item) =>
                    getRemainingTime(item.startTime, item.durasi) === "Habis",
                ).length
              }
            </h2>

            <p>Melebihi Durasi</p>

            <i className="fa-solid fa-car"></i>
          </div>
        </div>

        {/* CONTENT */}

        <div className="content">
          <div className="table-box">
            {/* PARKING MAP */}

            <ParkingMap
              data={data}
              search={search}
              mapFilter={mapFilter}
              setMapFilter={setMapFilter}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);

                setOpenModal(true);
              }}
            />

            {/* HEADER */}
            <div className="search-box table-search">
              <i className="fa-solid fa-magnifying-glass"></i>

              <input
                type="text"
                placeholder="Cari nama / no kendaraan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="table-header">
              <div className="section-title">Data Transaksi</div>

              <div className="table-right">
                {/* BUTTON TAMBAH */}

                <button className="add-btn" onClick={() => setOpenModal(true)}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            {/* TABLE */}

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Slot</th>
                  <th>Nama</th>
                  <th>No Kendaraan</th>
                  <th>Durasi</th>
                  <th>Mulai</th>
                  <th>Selesai</th>
                  <th>Sisa Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.slot}</td>

                    <td>{item.nama}</td>

                    <td>
                      <span className={`badge ${item.status}`}>
                        {item.kendaraan}
                      </span>
                    </td>

                    <td>{item.durasi} Jam</td>

                    <td>{item.mulai}</td>

                    <td>{item.selesai}</td>

                    <td>
                      <span className="countdown-badge">
                        {getRemainingTime(item.startTime, item.durasi)}
                      </span>
                    </td>

                    <td>
                      <button
                        className="finish-btn"
                        onClick={() => handleFinishParking(item.slot)}
                      >
                        Selesai
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTIVITY */}

          <div className="activity-box">
            <div className="section-title">Aktivitas Hari Ini</div>

            <div className="activity-item">
              <div className="activity-icon bg-blue">
                <i className="fa-solid fa-user"></i>
              </div>

              <div className="activity-content">
                <h5>Mobil Masuk</h5>

                <p>5 menit yang lalu</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon bg-green">
                <i className="fa-solid fa-car-side"></i>
              </div>

              <div className="activity-content">
                <h5>Mobil Keluar</h5>

                <p>10 menit yang lalu</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon bg-orange">
                <i className="fa-solid fa-calendar-check"></i>
              </div>

              <div className="activity-content">
                <h5>Mobil Booking</h5>

                <p>30 menit yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}

      {/* MODAL */}

      {openModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* HEADER */}

            <div className="modal-header">
              <div>
                <h3>Tambah Booking</h3>

                <p className="selected-slot">Pilih slot parkir tersedia</p>
              </div>

              <button className="close-btn" onClick={() => setOpenModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* SLOT */}

            <div className="form-group">
              <label>Slot Parkir</label>

              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="select-input"
              >
                <option value="">-- Pilih Slot --</option>

                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.id}
                  </option>
                ))}
              </select>
            </div>

            {/* NAMA */}

            <div className="form-group">
              <label>Nama</label>

              <input
                type="text"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
              />
            </div>

            {/* KENDARAAN */}

            <div className="form-group">
              <label>No Kendaraan</label>

              <input
                type="text"
                value={form.kendaraan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kendaraan: e.target.value,
                  })
                }
              />
            </div>

            {/* DURASI */}

            <div className="form-group">
              <label>Durasi</label>

              <input
                type="number"
                placeholder="Jam"
                value={form.durasi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durasi: e.target.value,
                  })
                }
              />
            </div>

            {/* BUTTON */}

            <button className="save-btn" onClick={handleSave}>
              Pesan Tempat Parkir
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* PARKING MAP */

function ParkingMap({ data, search, onSelectSlot, mapFilter, setMapFilter }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((v) => v + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const slots = initialSlots.map((slot) => ({
    ...slot,

    occupied: data.find((d) => d.slot === slot.id),
  }));

  /* STATUS SLOT */

  const getSlotStatus = (slot) => {
    if (!slot.occupied) {
      return "available";
    }

    const remaining = getRemainingTime(
      slot.occupied.startTime,
      slot.occupied.durasi,
    );

    if (remaining === "Habis") {
      return "overtime";
    }

    return "occupied";
  };

  /* VISIBILITY */

  /* VISIBILITY */

  const isSlotVisible = (slot) => {
    const status = getSlotStatus(slot);

    /* FILTER MAP */

    let visibleByFilter = true;

    if (mapFilter === "available") {
      visibleByFilter = status === "available";
    }

    if (mapFilter === "occupied-all") {
      visibleByFilter = status === "occupied" || status === "overtime";
    }

    if (mapFilter === "occupied") {
      visibleByFilter = status === "occupied";
    }

    if (mapFilter === "overtime") {
      visibleByFilter = status === "overtime";
    }

    /* FILTER SEARCH */

    if (!search) {
      return visibleByFilter;
    }

    const keyword = search.toLowerCase();

    const matchedData = data.find(
      (item) =>
        item.slot === slot.id &&
        (item.nama.toLowerCase().includes(keyword) ||
          item.kendaraan.toLowerCase().includes(keyword)),
    );

    return visibleByFilter && !!matchedData;
  };

  return (
    <div className="parking-map-wrapper">
      <div className="parking-map-header">
        <div>
          <h2 className="section-title">Denah Parkiran</h2>

          <p className="map-subtitle">Monitoring slot parkir realtime</p>
        </div>

        {/* LEGEND */}

        <div className="map-legend">
          <div
            className={`legend-item ${
              mapFilter === "all" ? "active-legend" : ""
            }`}
            onClick={() => setMapFilter("all")}
          >
            <div className="legend-color green-box"></div>
            <div className="legend-color red-box"></div>
            <div className="legend-color orange-box"></div>
            Semua
          </div>

          <div
            className={`legend-item ${
              mapFilter === "available" ? "active-legend" : ""
            }`}
            onClick={() => setMapFilter("available")}
          >
            <div className="legend-color green-box"></div>
            Tersedia
          </div>

          <div
            className={`legend-item ${
              mapFilter === "occupied-all" ? "active-legend" : ""
            }`}
            onClick={() => setMapFilter("occupied-all")}
          >
            <div className="legend-color red-box"></div>
            <div className="legend-color orange-box"></div>
            Terisi Semua
          </div>

          <div
            className={`legend-item ${
              mapFilter === "occupied" ? "active-legend" : ""
            }`}
            onClick={() => setMapFilter("occupied")}
          >
            <div className="legend-color red-box"></div>
            Terisi
          </div>

          <div
            className={`legend-item ${
              mapFilter === "overtime" ? "active-legend" : ""
            }`}
            onClick={() => setMapFilter("overtime")}
          >
            <div className="legend-color orange-box"></div>
            Overtime
          </div>
        </div>
      </div>

      {/* MAP */}

      <div className="parking-stage">
        <Stage width={700} height={320}>
          <Layer>
            {/* JALAN */}

            <Rect
              x={20}
              y={125}
              width={650}
              height={70}
              fill="#CBD5E1"
              cornerRadius={20}
            />

            <Text
              x={260}
              y={148}
              text="JALUR KENDARAAN"
              fontSize={20}
              fill="#475569"
              fontStyle="bold"
            />

            {/* SLOT */}

            {slots.map((slot, index) => {
              const x = 40 + (index % 4) * 150;

              const y = index < 4 ? 20 : 220;

              return (
                <React.Fragment key={slot.id}>
                  <Rect
                    x={x}
                    y={y}
                    width={100}
                    height={70}
                    fill={
                      !isSlotVisible(slot)
                        ? "#9CA3AF"
                        : getSlotStatus(slot) === "available"
                          ? "#22C55E"
                          : getSlotStatus(slot) === "overtime"
                            ? "#F97316"
                            : "#EF4444"
                    }
                    cornerRadius={14}
                    shadowBlur={10}
                    shadowColor="black"
                    shadowOpacity={0.2}
                    onClick={() => {
                      if (!slot.occupied) {
                        onSelectSlot(slot.id);
                      }
                    }}
                  />

                  <Text
                    x={x + 30}
                    y={y + 12}
                    text={slot.id}
                    fontSize={22}
                    fill={!isSlotVisible(slot) ? "#E5E7EB" : "white"}
                    fontStyle="bold"
                  />

                  {slot.occupied && isSlotVisible(slot) && (
                    <Text
                      x={x + 5}
                      y={y + 42}
                      width={90}
                      align="center"
                      text={getRemainingTime(
                        slot.occupied.startTime,
                        slot.occupied.durasi,
                      )}
                      fontSize={11}
                      fill="white"
                      fontStyle="bold"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default App;
