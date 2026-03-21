// 初始化地圖
const map = L.map("map").setView([25.033, 121.565], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

// 🔥 用來記錄目前的 marker
let currentMarker = null;

// 顯示某個路燈
function showLamp(id) {
  fetch(`https://lamp-api-bc33.onrender.com/lamp/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("查無此路燈編號");
        return;
      }

      // API 的 lat 是經度，lng 是緯度 → 交換
      const lat = Number(data.lng); // 緯度（24.xxx）
      const lng = Number(data.lat); // 經度（121.xxx）

      // 🔥 清除舊的 marker
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      // 新 marker
      currentMarker = L.marker([lat, lng]).addTo(map);

      currentMarker.bindPopup(`
        <b>路燈編號：</b>${data.id}<br>
        <b>地址：</b>${data.address}<br>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank">導航</a>
      `);

      map.setView([lat, lng], 18);
      currentMarker.openPopup();
    })
    .catch(err => {
      console.error(err);
      alert("API 錯誤");
    });
}

// 搜尋功能
function searchLamp() {
  const id = document.getElementById("lampInput").value.trim();
  if (!id) {
    alert("請輸入路燈編號");
    return;
  }
  showLamp(id);
}
