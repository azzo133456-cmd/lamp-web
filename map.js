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

      const lat = Number(data.lat);
      const lng = Number(data.lng);

      const marker = L.marker([lat, lng]).addTo(map);

      marker.bindPopup(`
        <b>路燈編號：</b>${data.id}<br>
        <b>地址：</b>${data.address}<br>
        <a href="${data.nav}" target="_blank">導航</a>
      `);

      map.setView([lat, lng], 18);
      marker.openPopup();
    });
}

// 搜尋框功能
function searchLamp() {
  const id = document.getElementById("lampInput").value.trim();
  if (id) showLamp(id);
}
