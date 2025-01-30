var clickedRental = null;

function initMap() {

  var map = L.map('map', {zoomControl: false}).setView([-37.8124, 144.9623], 11);

  // Add zoom control to bottom right
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  map.on('click', function() {
    console.log("Map clicked");
    clickedRental = {"address":"-", "suburb":"", "state":"", "rating":0, "review":""};
    updateDOM();
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  return map;
}

// register on change for rating filter
function registerFilters() {
  document.getElementById('1-star-filter').addEventListener('change', function() {
    toggleMarkers(1);
  });
  document.getElementById('2-star-filter').addEventListener('change', function() {
    toggleMarkers(2);
  });
  document.getElementById('3-star-filter').addEventListener('change', function() {
    toggleMarkers(3);
  });
  document.getElementById('4-star-filter').addEventListener('change', function() {
    toggleMarkers(4);
  });
  document.getElementById('5-star-filter').addEventListener('change', function() {
    toggleMarkers(5);
  });
}

var poopIcon = L.icon({
  iconUrl: 'assets/poop.png',
  iconSize:     [38, 38],
});

var thumbsDownIcon = L.icon({
  iconUrl: 'assets/thumbs-down.png',
  iconSize:     [38, 38], 
});

var neutralIcon = L.icon({
  iconUrl: 'assets/neutral.png',
  iconSize:     [38, 38],
});

var thumbsUpIcon = L.icon({
  iconUrl: 'assets/thumbs-up.png',
  iconSize:     [38, 38],
});

var starIcon = L.icon({
  iconUrl: 'assets/star.png',
  iconSize:     [38, 38],
});

function toggleMarkers(rating) {
  switch (rating) {
    case 1:
      targetMarker = poopIcon;
      break;
    case 2:
      targetMarker = thumbsDownIcon;
      break;
    case 3:
      targetMarker = neutralIcon;
      break;
    case 4:
      targetMarker = thumbsUpIcon;
      break;
    case 5:
      targetMarker = starIcon;
      break;
    default:
  }

  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker) {
      if (layer.options.icon && layer.options.icon.options.iconUrl === targetMarker.options.iconUrl) {
        // toggle visibility
        if (layer.options.opacity === 0) {
          layer.setOpacity(1);
        } else {
          layer.setOpacity(0);
        }
      }
    }
  });
}

async function fetchData(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Data is returned after the promise resolves
  } catch (error) {
      console.error("Error fetching data:", error);
      return null;
  }
}

function updateDOM() {
  document.querySelectorAll('.property-title h2').forEach(el => {
      el.textContent = clickedRental.address;
  });

  fields = document.querySelectorAll('.card-body .field');
  fields[0].querySelector('input').value = clickedRental.suburb;
  fields[1].querySelector('span').textContent = clickedRental.state;

  const stars = document.querySelectorAll(".rating span");
  stars.forEach((star, index) => {
    if (index < clickedRental.rating) {
      star.style.display = "inline"; // Highlight filled stars
    } else {
      star.style.display = "none"; // Dim unfilled stars
    }
  });

  fields[4].querySelector('textarea').textContent = clickedRental.review;
}

function populateMap() {
  (async () => {
    const url = "./rentals-data.json";
    const rentals = await fetchData(url); // Awaits the resolution before proceeding
  
    // Create a layer group to hold markers
    const poopGrp = L.layerGroup().addTo(map);
    const thumbsDownGrp = L.layerGroup().addTo(map);
    const neutralGrp = L.layerGroup().addTo(map);
    const thumbsUpGrp = L.layerGroup().addTo(map);
    const starGrp = L.layerGroup().addTo(map);

    rentals.forEach(rental => {
      let icon, group;
      switch (rental.rating) {
        case 1:
          icon = poopIcon;
          group = poopGrp;
          break;
        case 2:
          icon = thumbsDownIcon;
          group = thumbsDownGrp;
          break;
        case 3:
          icon = neutralIcon;
          group = neutralGrp;
          break;
        case 4:
          icon = thumbsUpIcon;
          group = thumbsUpGrp;
          break;
        case 5:
          icon = starIcon;
          group = starGrp;
          break;
        default:
          icon = neutralIcon;
          group = neutralGrp;
      }
      const marker = L.marker([rental.lat, rental.lon], {icon: icon});
  
      marker.on('click', () => {
        clickedRental = rental;
        openPopup();
        updateDOM();
      });

      group.addLayer(marker);
    });

    var layerControl = L.control.layers().addTo(map);
    layerControl.addOverlay(poopGrp, "poop-1");
    layerControl.addOverlay(thumbsDownGrp, "thumbs down-2");
    layerControl.addOverlay(neutralGrp, "neutral-3");
    layerControl.addOverlay(thumbsUpGrp, "thumbs up-4");
    layerControl.addOverlay(starGrp, "star-5");
  
  })();
}

// search suburb enter event
function addEnterEventSearchSuburb() {
  const input = document.getElementById("suburbInput");
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchSuburb();
    }
  });
}


async function searchSuburb() {
  const suburb = document.getElementById('suburbInput').value.trim();
  const resultsDiv = document.getElementById('results');

  if (!suburb) {
    resultsDiv.innerHTML = `<p style="color: red;">Please enter a suburb name.</p>`;
    return;
  }

  resultsDiv.innerHTML = `<p>Searching...</p>`;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(suburb)}&format=json&addressdetails=1`);
    const data = await response.json();

    if (data.length === 0) {
      resultsDiv.innerHTML = `<p style="color: red;">No results found for "${suburb}".</p>`;
      return;
    }

    const { lat, lon, display_name } = data[0];
    // update map
    map.panTo([lat, lon], 11);

    resultsDiv.innerHTML = `
      <p><strong>Location:</strong> ${display_name}</p>
    `;
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color: red;">An error occurred. Please try again.</p>`;
    console.error(error);
  }
}

var map = initMap();
// registerFilters();
populateMap();

const popupOverlay = document.querySelector('.popup-overlay');
const closeButton = document.querySelector('.close-button');

function openPopup() {
    popupOverlay.classList.add('active');
}

function closePopup() {
    popupOverlay.classList.remove('active');
}

// Event listeners
closeButton.addEventListener('click', closePopup);

// Close popup when clicking outside the card
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        closePopup();
    }
});

// Close popup when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePopup();
    }
});