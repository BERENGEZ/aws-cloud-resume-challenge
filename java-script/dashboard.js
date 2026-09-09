// 1. Log a new visitor EXACTLY ONCE when the page loads
async function logVisit() {
  try {
    await fetch("https://barakaberenge.com/api/count", { method: "POST" });
  } catch (error) {
    console.error("Failed to log visit:", error);
  }
}
logVisit();

// 2. Helper function to safely update HTML elements if they exist
function safeUpdate(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = text;
  }
}

// 3. Function to fetch and update server metrics
async function updateTelemetry() {
  const startTime = performance.now(); // Start timer for latency

  try {
    const response = await fetch("https://barakaberenge.com/api/telemetry");
    const data = await response.json();

    const endTime = performance.now(); // End timer for latency
    const latency = Math.round(endTime - startTime);

    // Update metrics safely (Will not crash if the ID is missing from the HTML)
    safeUpdate("api-status", `🟢 ${data.status}`);
    safeUpdate("api-latency", `${latency} ms`);
    safeUpdate("sys-uptime", data.uptime);
    safeUpdate("sys-cpu", data.cpu_usage);
    safeUpdate("sys-ram", data.ram_usage);
    safeUpdate("sys-kernel", data.kernel);
    safeUpdate("sys-os", data.os);
    safeUpdate("visitor-count", data.visitors);
  } catch (error) {
    console.error("Telemetry Fetch Error:", error);

    // If the API crashes or is unreachable, safely update what we can
    safeUpdate("api-status", "🔴 Offline");

    // Safely change color if api-status exists
    const statusEl = document.getElementById("api-status");
    if (statusEl) {
      statusEl.style.color = "#ef4444";
    }

    const fallbackText = "ERR";
    safeUpdate("api-latency", fallbackText);
    safeUpdate("sys-uptime", fallbackText);
    safeUpdate("sys-cpu", fallbackText);
    safeUpdate("sys-ram", fallbackText);
    safeUpdate("visitor-count", fallbackText);
  }
}

// Run immediately when the script loads
updateTelemetry();

// Refresh the data automatically every 5 seconds
setInterval(updateTelemetry, 5000);
