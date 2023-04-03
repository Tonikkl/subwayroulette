// Select DOM elements
const checkboxesContainer = document.querySelector('.checkboxes');
const stationName = document.getElementById('station-name');
const resultContainer = document.getElementById('result-container');
const result = document.getElementById('result');
const spinButton = document.getElementById('spin-button');
const light = document.getElementById('light');

// Initialize the app
function init() {
  checkboxesContainer.innerHTML = generateCheckboxes(stations);
  spinButton.addEventListener('click', spinWheel);
}

// Handle spin button click
function spinWheel() {
  light.style.display = 'block';
  resultContainer.style.display = 'none';

  const includedStations = getIncludedStations();

  if (includedStations.length === 0) {
    alert('Please include at least one station.');
    return;
  }

  const stationCount = includedStations.length;
  const spinDuration = 3000; // 3 seconds
  let spinSpeed = 500; // initial speed
  let rotationCount = 0;
  let rotationInterval = setInterval(rotate, spinSpeed);

  // Gradually slow down the spin
  const speedInterval = setInterval(() => {
    spinSpeed += 20;
    if (spinSpeed >= 1000) clearInterval(speedInterval); // Maximum spin speed
  }, 100);

  // Stop the spin and show the result
  setTimeout(() => {
    clearInterval(rotationInterval);

    const index = Math.floor(Math.random() * stationCount);
    const station = includedStations[index];
    includedStations.splice(index, 1);
    const searchQuery = encodeURIComponent(`${station} station`);
    const mapLink = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${searchQuery}`;
    result.innerHTML = `<iframe width="600" height="450" frameborder="0" style="border:0" allowfullscreen src="${mapLink}"></iframe>`;
    resultContainer.style.display = 'block';
    light.style.display = 'none';

    // Uncheck the selected station
    document.querySelectorAll('input[name="station"]').forEach((checkbox) => {
      if (checkbox.value === station) checkbox.checked = false;
    });

    // Flash the result and trigger fireworks
    let flashCount = 0;
    const flashInterval = setInterval(() => {
      resultContainer.style.display = flashCount % 2 === 0 ? 'none' : 'block';
      flashCount++;
      if (flashCount > 10) {
        clearInterval(flashInterval);
        fireworks(15);
      }
    }, 50);
  }, spinDuration);

  // Rotate the wheel and update the station name
  function rotate() {
    stationName.innerHTML = includedStations[rotationCount % stationCount];
    rotationCount++;
  }
}
