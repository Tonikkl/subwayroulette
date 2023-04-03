let stations = [];

fetch("stations.txt")
  .then(response => response.text())
  .then(data => {
    stations = data.trim().split("\n");
    displayStations();
  })
  .catch(error => console.error(error));

const light = document.getElementById("light");
const resultContainer = document.getElementById("result-container");
const result = document.getElementById("result");
const stationsForm = document.getElementById("stations-form");

let APIKey = prompt("Please enter your Google Maps API key:");

function getIncludedStations() {
  return Array.from(stationsForm.querySelectorAll('input[type="checkbox"]'))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function spin() {
  light.style.display = "block";
  resultContainer.style.display = "none"; 

  const includedStations = getIncludedStations();

  if (includedStations.length === 0) {
    alert("Please include at least one station.");
    return;
  }

  let i = 0;
  let spinSpeed = 50; // initial speed
  let spinInterval = setInterval(() => {
    i = (i + 1) % stations.length;
    stationsForm.scroll(0, 30 * i);
    if (i > 20 + (spinSpeed * 5)) { // stop after a few seconds
      clearInterval(spinInterval);
      const index = Math.floor(Math.random() * includedStations.length);
      const station = includedStations[index];
      includedStations.splice(index, 1);
      const searchQuery = encodeURIComponent(`${station} station`);
      const mapLink = `https://www.google.com/maps/embed/v1/search?key=${APIKey}&q=${searchQuery}`;
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
    }
  }, spinSpeed);

  // gradually slow down the spin
  let speedInterval = setInterval(() => {
    spinSpeed += 10;
    if (spinSpeed > 300) { // maximum spin speed
      clearInterval(speedInterval);
    }
  }, 100);
}

function displayStations() {
  const fragment = document.createDocumentFragment();
  stations.forEach((station) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "station";
    input.value = station;
    label.appendChild(input);
    label.appendChild(document.createTextNode(station));
    fragment.appendChild(label);
    fragment.appendChild(document.createElement("br"));
  });
  stationsForm.appendChild(fragment);
}
