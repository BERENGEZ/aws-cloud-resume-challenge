const apiEndpoint =
  "https://g3dbaub1j8.execute-api.eu-north-1.amazonaws.com/counter";
async function loadDashboard() {
  const startTime = performance.now(); // Start clocking latency
  try {
    // Append a unique timestamp (?t=...) to bypass local caching
    const cacheBuster = `?t=${new Date().getTime()}`;
    const response = await fetch(apiEndpoint + cacheBuster);

    if (!response.ok) {
      throw new Error("API unavailable");
    }

    const data = await response.json();
    const endTime = performance.now(); // End clocking latency

    // Calculate exact difference
    let latency = Math.round(endTime - startTime);
    if (latency === 0) latency = 1; // Safeguard for hyper-fast micro-speeds

    // Update Dashboard Metrics
    document.getElementById("visitor-count").innerText = data.count;
    document.getElementById("api-status").innerText = "🟢 Online";
    document.getElementById("api-status").style.color = "#22c55e";
    document.getElementById("api-latency").innerText = `${latency}ms`;
  } catch (error) {
    console.error("Dashboard metric fetch failed:", error);
    document.getElementById("visitor-count").innerText = "Unavailable";
    document.getElementById("api-status").innerText = "🔴 Offline";
    document.getElementById("api-status").style.color = "#ef4444";
    document.getElementById("api-latency").innerText = "Error";
  }
}
loadDashboard();
