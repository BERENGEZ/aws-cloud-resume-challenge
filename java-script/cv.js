// My live production AWS API Gateway Backend Endpoint
const apiEndpoint =
  "https://g3dbaub1j8.execute-api.eu-north-1.amazonaws.com/counter";
async function getVisitorCount() {
  try {
    // Checks to make sure the endpoint string exists and isn't empty
    if (apiEndpoint) {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      document.getElementById("counter").innerText = data.count;
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
