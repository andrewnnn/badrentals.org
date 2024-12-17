
const state = new Proxy(
  {clickedRental: null},
  {
    set(target, key, value) {
      if (key === "clickedRental" && target[key] !== value && value !== null) {
        target[key] = value;
        showCard();
      } else {
        hideCard();
      }
      return true; // Return success
    },
  }
);


var map = L.map('map').setView([-37.8124, 144.9623], 11);

map.on('click', function() {
  console.log("Map clicked");
  state.clickedRental = null;
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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

STATIC_URL = "static/rental_reviews/";

var poopIcon = L.icon({
  iconUrl: STATIC_URL + 'assets/poop.png',

  iconSize:     [38, 38], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var thumbsDownIcon = L.icon({
  iconUrl: STATIC_URL + 'assets/thumbs-down.png',

  iconSize:     [38, 38], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var neutralIcon = L.icon({
  iconUrl: STATIC_URL + 'assets/neutral.png',

  iconSize:     [38, 38], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var thumbsUpIcon = L.icon({
  iconUrl: STATIC_URL + 'assets/thumbs-up.png',

  iconSize:     [38, 38], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var starIcon = L.icon({
  iconUrl: STATIC_URL + 'assets/star.png',

  iconSize:     [38, 38], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function showCard() {
  document.querySelector('.card').style.display = 'block';
  document.querySelectorAll('.property-title h2').forEach(el => {
      el.textContent = state.clickedRental.address;
  });

  fields = document.querySelectorAll('.card-body .field');
  fields[0].querySelector('input').value = state.clickedRental.suburb;
  fields[1].querySelector('span').textContent = state.clickedRental.state;

  const stars = document.querySelectorAll(".rating span");
  stars.forEach((star, index) => {
    if (index < state.clickedRental.reviews[0].rating) {
      star.style.display = "inline"; // Highlight filled stars
    } else {
      star.style.display = "none"; // Dim unfilled stars
    }
  });

  fields[4].querySelector('textarea').textContent = state.clickedRental.reviews[0].review;
}

function hideCard() {
  document.querySelector('.card').style.display = 'none';
}


(async () => {
  const url = "rental_data.json";
  const rentals = await fetchData(url); // Awaits the resolution before proceeding

  rentals.forEach(rental => {
    let icon;
    switch (rental.reviews[0].rating) {
      case 1:
        icon = poopIcon;
        break;
      case 2:
        icon = thumbsDownIcon;
        break;
      case 3:
        icon = neutralIcon;
        break;
      case 4:
        icon = thumbsUpIcon;
        break;
      case 5:
        icon = starIcon;
        break;
      default:
        icon = neutralIcon;
    }
    const marker = L.marker([rental.lat, rental.lon], {icon: icon}).addTo(map);
    marker.bindPopup(rental.address);

    marker.on('click', () => {
      console.log("map center", map.getCenter());
      console.log("marker center", marker.getLatLng());

      map.setView([rental.lat, rental.lon]);
      marker.openPopup();
      state.clickedRental = rental;
      showCard();
    });

  });

})();

// search suburb enter event
const input = document.getElementById("suburbInput");
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchSuburb();
  }
});

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


const toastLiveExample = document.getElementById('liveToast')

if (toastLiveExample) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastBootstrap.show();
}
