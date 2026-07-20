function switchTab(tabId) {
  // 1. Hide all tab content
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.style.display = "none";
  });

  // 2. Remove 'active' class from all buttons
  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  // 3. Show the selected tab content
  document.getElementById(tabId).style.display = "block";

  // 4. Add 'active' class to the clicked button
  // (We find the button that triggered the function by matching the onclick attribute)
  const clickedButton = document.querySelector(
    `button[onclick="switchTab('${tabId}')"]`,
  );
  if (clickedButton) {
    clickedButton.classList.add("active");
  }
}
// ==========================================
// CONFIGURATION GALLERY TOGGLE
// ==========================================
function toggleConfig(configId, buttonElement) {
  const content = document.getElementById(configId);
  const icon = buttonElement.querySelector(".toggle-icon");

  if (content.style.display === "none") {
    // Show the code block
    content.style.display = "block";
    icon.style.transform = "rotate(180deg)"; // Flip arrow up
  } else {
    // Hide the code block
    content.style.display = "none";
    icon.style.transform = "rotate(0deg)"; // Flip arrow down
  }
}
