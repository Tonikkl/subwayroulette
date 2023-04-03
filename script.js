function spin() {
  light.style.display = "block";
  resultContainer.style.display = "none";

  const includedStations = getIncludedStations();

  if (includedStations.length === 0) {
    alert("Please include at least one station.");
    return;
  }

  const stationCount = includedStations.length;
  const spinDuration = 3000; // 3 seconds
  let spinSpeed = 500; // initial speed
  let rotationCount = 0;
  let rotationInterval = setInterval(() => {
    stationName.innerHTML = includedStations[rotationCount % stationCount];
    rotationCount++;
  }, spinSpeed);

  // gradually slow down the spin
  setTimeout(() => {
    clearInterval(rotationInterval);
    const index = Math.floor(Math.random() * stationCount);
    const station = includedStations[index];
    includedStations.splice(index, 1);
    const searchQuery = encodeURIComponent(`${station} station`);
    const mapLink = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${searchQuery}`;
    result.innerHTML = `<iframe width="600" height="450" frameborder="0" style="border:0" allowfullscreen src="${mapLink}"></iframe>`;
    resultContainer.style.display = "block";
    light.style.display = "none";

    // uncheck the selected station
    const checkboxes = document.querySelectorAll('input[name="station"]');
    checkboxes.forEach((checkbox) => {
      if (checkbox.value === station) {
        checkbox.checked = false;
      }
    });

    // flash the result
    let flashCount = 0;
    let flashInterval = setInterval(() => {
      resultContainer.style.display = flashCount % 2 === 0 ? "none" : "block";
      flashCount++;
      if (flashCount > 10) {
        clearInterval(flashInterval);
        // call firework function after flash
        fireworks(15);
      }
    }, 50);
  }, spinDuration);

  let speedInterval = setInterval(() => {
    spinSpeed += 20;
    if (spinSpeed >= 1000) { // maximum spin speed
      clearInterval(speedInterval);
    }
  }, 100);
}
