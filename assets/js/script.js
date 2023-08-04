var dropdowns = document.getElementsByClassName("dropdown-content"); //dropdown options for both buttons
var bahamasLI = document.getElementById("bahamas-btn") //bahamas dropdown option on button 1
var carribeanLI = document.getElementById("carribean-btn") //carribean dropdown option on button1
var cruisedaysLI = document.getElementById("4day-btn") //4-day cruise dropdown option on button2
var dropdownList1 = document.getElementById("myDropdown1") //dropdown for button 1
var dropdownList2 = document.getElementById("myDropdown2") //dropdown for button 2
var button1 = document.getElementById("button1") //button 1
var button2 = document.getElementById("button2") //button 2

//if active button is clicked, 
//then replace button text to dropdown list item

//submit will take in selected items for dropdown list 1 and dropdown list 2

//if option 1 is clicked, display itinerary 1
//if option 2 is clicked, display itinerary 2


function myFunction(element) {

  // element.nextSibling is the carriage return… The dropdown menu is the next next.
  var thisDropdown = element.nextSibling.nextSibling;

  if (!thisDropdown.classList.contains('show')) {  // Added to hide dropdown if clicking on the one already open
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show');
    }
  }

  // Toggle the dropdown on the element clicked
  thisDropdown.classList.toggle("show");
}

/* function to close the dropdown when clicked outside. */
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// set map option  to miami port//                       google maps                      //

var mylatlng = { lat: 25.778135, lng: -80.179100 };
var mapOptions = {
  center: mylatlng,
  zoom: 12,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};
// create map //

var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

// create directions service object to use the route method and get a result for the request//
var directionsService = new google.maps.DirectionsService();
// create a direction RENDER object which will display the route //
var directionsDisplay = new google.maps.DirectionsRenderer();
// bind  the directionsRENDER to the map//
directionsDisplay.setMap(map);

function calcRoute() {

  var request = {
      origin: document.getElementById("from").value,
      destination: document.getElementById("to").value,
      travelMode: google.maps.TravelMode.DRIVING, // can change or add for WALKING, BYCYCLING, TRANSIT
      unitSystem: google.maps.UnitSystem.IMPERIAL
  }

  // pass request to route method, get distance and time //
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {

      const output = document.querySelector('#output');
      output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";
      // display route and delete//
      directionsDisplay.setDirections(result);
    } else {
      directionsDisplay.setDirections({ routes: [] });

      let map;
      // initMap is now async
      async function initMap() {
        // Request libraries when needed, not in the script tag
        const { Map } = await google.maps.importLibrary("maps");
        // Short namespaces can be used
        map = new Map(document.getElementById("map"), {
          center: { lat: 25.778135, lng: -80.179100 },
          zoom: 12,
        });
      }

      initMap();
           // error message if driving not possible //
      output.innerHTML = "<div class='alert-danger><i class='fa-thin fa-circle-exclamation'></i> Driving distance not possible. </div>";
    }
  });

}

// auto complete function for inputs //
var options = {
  types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);

//         //                 Weather Api              //             //
let weather = {
  apiKey: "7e68cdfa71c2c8c17187eb95320793b0",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°F";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " MPH";
    document.querySelector(".weather").classList.remove("loading");
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});


document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

weather.fetchWeather("Miami");

//            //                  //                     //                 // 




document.addEventListener("DOMContentLoaded", () => {
  const exchangeRatesEndpoint = "https://api.exchangerate-api.com/v4/latest/USD";
  const exchangeSection = document.getElementById("exchange-rates");

  async function fetchExchangeRates() {
    try {
      const response = await fetch(exchangeRatesEndpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  function showExchangeRates(data) {
    exchangeSection.innerHTML = "";

    if (!data) {
      exchangeSection.innerText = "Failed to fetch exchange rates. Please try again later.";
      return;
    }

    const { base, rates } = data;
    const currencies = Object.keys(rates);
    currencies.forEach((currency) => {
      const rate = rates[currency].toFixed(2);
      const countryName = getCountryName(currency);
      const rateElement = document.createElement("li");
      rateElement.innerText = `1 ${base} = ${rate} ${countryName ? countryName : currency}`;
      exchangeSection.appendChild(rateElement);
    });
  }

  async function updateExchangeRates() {
    exchangeSection.innerHTML = '<div class="loader"></div>';

    const data = await fetchExchangeRates();
    showExchangeRates(data);
  }

  function getCountryName(currencyCode) {
    const countryNames = {
      USD: "USD: United States",
      EUR: "EUR: Eurozone",
      GBP: "GBP: United Kingdom",
      JPY: "JPY: Japan",
      AUD: "AUD: Australia",
      CAD: "CAD: Canada",
      CHF: "CHF: Switzerland",
      CNY: "CNY: China",
      SEK: "SEK: Sweden",
      NZD: "NZD: New Zealand",
      INR: "INR: India",
      AED: "AED: United Arab Emirates",
      BRL: "BRL: Brazil",
      SGD: "SGD: Singapore",
      HKD: "HKD: Hong Kong",
      MXN: "MXN: Mexico",
      ZAR: "ZAR: South Africa",
      SAR: "SAR: Saudi Arabia",
      KRW: "KRW: South Korea",
      RUB: "RUB: Russia",
      IDR: "IDR: Indonesia",
      TRY: "TRY: Turkey",
      THB: "THB: Thailand",
      PLN: "PLN: Poland",
      ILS: "ILS: Israel",
      NOK: "NOK: Norway",
      DKK: "DKK: Denmark",
      MYR: "MYR: Malaysia",
      HUF: "HUF: Hungary",
      CZK: "CZK: Czech Republic",
      PHP: "PHP: Philippines",
      BGN: "BGN: Bulgaria",
      BRL: "BRL: Brazil",
      CLP: "CLP: Chile",
      CNY: "CNY: China",
      COP: "COP: Colombia",
      HRK: "HRK: Croatia",
      HUF: "HUF: Hungary",
      IDR: "IDR: Indonesia",
      ILS: "ILS: Israel",
      INR: "INR: India",
      ISK: "ISK: Iceland",
      JPY: "JPY: Japan",
      KRW: "KRW: South Korea",
      MXN: "MXN: Mexico",
      MYR: "MYR: Malaysia",
      NOK: "NOK: Norway",
      NZD: "NZD: New Zealand",
      PHP: "PHP: Philippines",
      PLN: "PLN: Poland",
      RON: "RON: Romania",
      RUB: "RUB: Russia",
      SEK: "SEK: Sweden",
      SGD: "SGD: Singapore",
      THB: "THB: Thailand",
      TRY: "TRY: Turkey",
      ZAR: "ZAR: South Africa",

    };

    return countryNames[currencyCode];
  }

  updateExchangeRates();


  setInterval(updateExchangeRates, 10000);
});
  dropBtnEl.addEventListener("click", dropMenuOptions)
