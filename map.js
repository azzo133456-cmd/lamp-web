// ------------------------------------------------------
// 🌍 初始化地圖
// ------------------------------------------------------
const map = L.map("map", {
  zoomControl: false
}).setView([25.033, 121.565], 12);

L.control.zoom({ position: "bottomleft" }).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

// 只保留最新 marker
let currentMarker = null;

// ------------------------------------------------------
// 🔥 使用你的正式 Railway API
// ------------------------------------------------------
const API_BASE = "https://api.azzo133456.page";

// ------------------------------------------------------
// 🔥 顯示某個路燈
// ------------------------------------------------------
function showLamp(id) {
  fetch(`${API_BASE}/lamp/${encodeURIComponent(id)}`, {
    cache: "no-store"
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("查無此路燈編號");
        return;
      }

      // ⭐ 正確 lat/lng（你的 DB 是 lat=經度, lng=緯度）
      const lat = Number(data.lng); // 緯度
      const lng = Number(data.lat); // 經度

      if (currentMarker) map.removeLayer(currentMarker);

      currentMarker = L.marker([lat, lng]).addTo(map);

      currentMarker.bindPopup(`
        <b>路燈編號：</b>${data.id}<br>
        <b>地址：</b>${data.address}<br>
        <a href="${data.nav}" target="_blank">導航</a>
      `);

      map.setView([lat, lng], 18);
      setTimeout(() => currentMarker.openPopup(), 300);
    })
    .catch(() => alert("API 連線失敗"));
}

// ------------------------------------------------------
// 🔍 搜尋功能
// ------------------------------------------------------
function searchLamp() {
  const input = document.getElementById("lampInput");
  const id = input.value.trim();
  if (!id) return alert("請輸入路燈編號");

  showLamp(id);
  input.value = "";
}

document.getElementById("lampInput").addEventListener("keydown", e => {
  if (e.key === "Enter") searchLamp();
});

// ------------------------------------------------------
// 📍 自動定位 + 找最近路燈
// ------------------------------------------------------
function locateUser() {
  if (!navigator.geolocation) {
    alert("此瀏覽器不支援定位功能");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async pos => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      if (currentMarker) map.removeLayer(currentMarker);

      currentMarker = L.marker([userLat, userLng], {
        icon: L.icon({
          iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
          iconSize: [32, 32]
        })
      }).addTo(map);

      currentMarker.bindPopup("你在這裡");
      map.setView([userLat, userLng], 18);
      setTimeout(() => currentMarker.openPopup(), 300);

      const nearest = await findNearestLamp(userLat, userLng);

      if (nearest && nearest.id) {
        const dist = nearest.distance * 1000;
        alert(`最近的路燈距離你約 ${Math.round(dist)} 公尺`);
        showLamp(nearest.id);
      }
    },
    () => alert("無法取得定位資訊")
  );
}

// ------------------------------------------------------
// 🔥 找最近路燈
// ------------------------------------------------------
async function findNearestLamp(lat, lng) {
  const res = await fetch(`${API_BASE}/nearest?lat=${lat}&lng=${lng}`, {
    cache: "no-store"
  });
  return await res.json();
}

setTimeout(() => map.invalidateSize(), 500);
