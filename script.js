// Apple Valley, CA coordinates
const NWS_URL =
  "https://api.allorigins.win/raw?url=" +
  encodeURIComponent("https://api.weather.gov/alerts/active?point=34.5,-117.2");

async function getJSON(url) {
  try {
    const r = await fetch(url + "&t=" + Date.now());
    return await r.json();
  } catch {
    return {};
  }
}

async function checkNWS() {
  const data = await getJSON(NWS_URL);
  if (!data.features) return;

  data.features.forEach(alert => {
    const title = alert.properties.headline || alert.properties.event;
    const body = alert.properties.description || "";
    notify(title, body);
  });
}

function checkTestAlert() {
  const raw = localStorage.getItem("testAlert");
  if (!raw) return;

  const test = JSON.parse(raw);
  notify(test.title, test.body);

  // Clear after showing
  localStorage.removeItem("testAlert");
}

function notify(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

async function loop() {
  await checkNWS();
  checkTestAlert();
  setTimeout(loop, 60000); // check every 60 seconds
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

loop();
