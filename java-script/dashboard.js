// 1. Log a new visitor EXACTLY ONCE
async function logVisit() {
  try {
    await fetch("https://barakaberenge.com/api/count", { method: "POST" });
  } catch (error) {
    console.error("Visit log failed silently.");
  }
}
logVisit();

// 2. Helper function to safely update HTML elements
function safeUpdate(id, text) {
  const element = document.getElementById(id);
  if (element) element.innerText = text;
}

// 3. Self-adjusting telemetry fetch loop
async function updateTelemetry() {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); 

  try {
    const response = await fetch("https://barakaberenge.com/api/telemetry", { signal: controller.signal });
    if (!response.ok) throw new Error("API returned non-200 status");
    
    const data = await response.json();
    clearTimeout(timeoutId); 
    
    const latency = Math.round(performance.now() - startTime);

    safeUpdate("api-status", `🟢 Online`);
    safeUpdate("api-latency", `${latency} ms`);
    safeUpdate("sys-uptime", data.uptime);
    safeUpdate("sys-cpu", data.cpu_usage);
    safeUpdate("sys-ram", data.ram_usage);
    safeUpdate("visitor-count", data.visitors);

    const statusEl = document.getElementById("api-status");
    if (statusEl) statusEl.style.color = "#4ade80"; 

    // Poll again in 5 seconds if successful
    setTimeout(updateTelemetry, 5000);
  } catch (error) {
    clearTimeout(timeoutId);
    
    safeUpdate("api-status", "⚪ Offline");
    const fallbackText = "---";
    safeUpdate("api-latency", fallbackText);
    safeUpdate("sys-uptime", fallbackText);
    safeUpdate("sys-cpu", fallbackText);
    safeUpdate("sys-ram", fallbackText);

    const statusEl = document.getElementById("api-status");
    if (statusEl) statusEl.style.color = "#9ca3af"; 

    // Back off and retry in 30 seconds if failed
    setTimeout(updateTelemetry, 30000);
  }
}

// Start the loop
updateTelemetry();