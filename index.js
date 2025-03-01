var map = L.map('map').setView([-37.8124, 144.9623], 11);

map.on('click', function() {
  console.log("Map clicked");
  clickedRental = {"address":"-", "suburb":"", "state":"", "rating":0, "review":""};
  updateDOM();
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// register on change for rating filter
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

var poopIcon = L.icon({
  iconUrl: 'assets/poop.png',

  iconSize:     [38, 38], // size of the icon
  // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var thumbsDownIcon = L.icon({
  iconUrl: 'assets/thumbs-down.png',

  iconSize:     [38, 38], // size of the icon
  // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var neutralIcon = L.icon({
  iconUrl: 'assets/neutral.png',

  iconSize:     [38, 38], // size of the icon
  // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var thumbsUpIcon = L.icon({
  iconUrl: 'assets/thumbs-up.png',

  iconSize:     [38, 38], // size of the icon
  // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var starIcon = L.icon({
  iconUrl: 'assets/star.png',

  iconSize:     [38, 38], // size of the icon
  // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

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

var clickedRental = null;

(async () => {
  const url = "./rentals-data.json";
  const rentals = await fetchData(url); // Awaits the resolution before proceeding

  rentals.forEach(rental => {
    let icon;
    switch (rental.rating) {
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
      marker.openPopup();
      clickedRental = rental;
      updateDOM();
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

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

document.addEventListener("DOMContentLoaded", function() {
  if (window.mobileCheck()) {
    document.getElementById('mobileMessage').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
  }
});
