// 初始化地圖
const map = L.map("map").setView([25.033, 121.565], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

// 顯示某個路燈
function showLamp(id) {
  fetch(`https://lamp-api-bc33.onrender.com/lamp/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("查無此路燈編號");
        return;
      }

      // 🔥🔥🔥 最重要：確保 lat / lng 是數字，而且順序正確
      const lat = Number(data.lat);  // 緯度（台灣約 24.x）
      const lng = Number(data.lng);  // 經度（台灣約 121.x）

      // 如果 lat < 20 或 lng < 100 → 代表順序反了
      if (lat < 20 || lng < 100) {
        console.warn("⚠ 偵測到經緯度順序反了，自動修正");
        // 自動交換
        const fixedLat = Number(data.lng);
        const fixedLng = Number(data.lat);
        return showFixedLamp(fixedLat, fixedLng, data);
      }

      placeMarker(lat, lng, data);
    });
}

// 正常放 marker
function placeMarker(lat, lng, data) {
  const marker = L.marker([lat, lng]).addTo(map);

  marker.bindPopup(`
    <b>路燈編號：</b>${data.id}<br>
    <b>地址：</b>${data.address}<br>
    <a href="${data.nav}" target="_blank">導航</a>
  `);

  map.setView([lat, lng], 18);
  marker.openPopup();
}

// 自動修正經緯度反轉
function showFixedLamp(lat, lng, data) {
  const marker = L.marker([lat, lng]).addTo(map);

  marker.bindPopup(`
    <b>路燈編號：</b>${data.id}<br>
    <b>地址：</b>${data.address}<br>
    <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank">導航</a>
  `);

  map.setView([lat, lng], 18);
  marker.openPopup();
}
