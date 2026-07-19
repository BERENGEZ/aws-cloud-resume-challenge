// 1. Log a new visitor EXACTLY ONCE when the page loads
async function logVisit() {
  try {
    // ⚠️ Replace with your actual domain name!
    await fetch("https://barakaberenge.com/api/count", { method: "POST" });
  } catch (error) {
    console.error("Failed to log visit:", error);
  }
}
logVisit();

// Function to fetch and update server metrics
async function updateTelemetry() {
  const startTime = performance.now(); // Start timer for latency

  try {
    // ⚠️ IMPORTANT: Replace this URL with your actual Flask API endpoint
    const response = await fetch("https://barakaberenge.com/api/telemetry");
    const data = await response.json();

    const endTime = performance.now(); // End timer for latency
    const latency = Math.round(endTime - startTime);

    // 1. Update API Status & Latency
    document.getElementById("api-status").innerText = `🟢 ${data.status}`;
    document.getElementById("api-latency").innerText = `${latency} ms`;

    // 2. Update Hardware Metrics
    document.getElementById("sys-uptime").innerText = data.uptime;
    document.getElementById("sys-cpu").innerText = data.cpu_usage;
    document.getElementById("sys-ram").innerText = data.ram_usage;
    document.getElementById("sys-kernel").innerText = data.kernel;
    document.getElementById("sys-os").innerText = data.os;

    // 3. Update Database Metrics
    document.getElementById("visitor-count").innerText = data.visitors;
  } catch (error) {
    console.error("Telemetry Fetch Error:", error);

    // If the API crashes or is unreachable, update the UI to reflect the outage
    document.getElementById("api-status").innerText = "🔴 Offline";
    document.getElementById("api-status").style.color = "#ef4444"; // Red text

    const fallbackText = "ERR";
    document.getElementById("api-latency").innerText = fallbackText;
    document.getElementById("sys-uptime").innerText = fallbackText;
    document.getElementById("sys-cpu").innerText = fallbackText;
    document.getElementById("sys-ram").innerText = fallbackText;
    document.getElementById("visitor-count").innerText = fallbackText;
  }
}

// 1. Run immediately when the script loads
updateTelemetry();

// 2. Refresh the data automatically every 5 seconds (5000 milliseconds)
setInterval(updateTelemetry, 5000);
