const apiEndpoint =
  "https://g3dbaub1j8.execute-api.eu-north-1.amazonaws.com/counter";

async function loadDashboard() {
  try {
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error("API unavailable");
    }

    const data = await response.json();

    document.getElementById("visitor-count").innerText = data.count;

    document.getElementById("api-status").innerText = "🟢 Online";
  } catch (error) {
    console.error(error);

    document.getElementById("visitor-count").innerText = "Unavailable";

    document.getElementById("api-status").innerText = "🔴 Offline";
  }
}

window.onload = loadDashboard;
