const apiEndpoint =
  "https://g3dbaub1j8.execute-api.eu-north-1.amazonaws.com/counter";

async function loadDashboard() {
  const startTime = performance.now(); // Start clocking latency
  try {
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error("API unavailable");
    }

    const data = await response.json();
    const endTime = performance.now(); // End clocking latency
    const latency = Math.round(endTime - startTime);

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

// Safe layout timing initialization listener
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(loadDashboard, 100);
} else {
  window.addEventListener("DOMContentLoaded", () =>
    setTimeout(loadDashboard, 100),
  );
}
