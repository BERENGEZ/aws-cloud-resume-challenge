// My live production Self-Hosted Nginx Backend Endpoint
const apiEndpoint = "/api/count";

async function getVisitorCount() {
  try {
    if (apiEndpoint) {
      // We must specify 'POST' to match the Python Flask routing rules
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      // Updated to match the "visitor_count" key returned by my new Python API
      document.getElementById("counter").innerText = data.visitor_count;
    } else {
      document.getElementById("counter").innerText = "0 (API pending)";
    }
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    document.getElementById("counter").innerText = "Error";
  }
}

// When the page loads, call the function
window.onload = getVisitorCount;
