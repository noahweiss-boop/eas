async function getJSON(url) {
  try {
    const r = await fetch(url + "?t=" + Date.now());
    return await r.json();
  } catch {
    return {};
  }
}

async function checkNWS() {
  const url = "https://api.weather.gov/alerts/active?point=34.5,-117.2";
  const data = await getJSON(url);

  if (!data.features) return;

  data.features.forEach(alert => {
    const title = alert.properties.headline || alert.properties.event;
    const body = alert.properties.description || "";
    notify(title, body);
  });
}

async function checkTestAlert() {
  const test = await getJSON("alerts.json");
  if (!test.id) return;
  notify(test.title, test.body);
}

function notify(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

async function loop() {
  await checkNWS();
  await checkTestAlert();
  setTimeout(loop, 60000);
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

loop();
