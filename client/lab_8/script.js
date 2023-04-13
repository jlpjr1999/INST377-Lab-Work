
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#restaurant_list');
    target.innerHTML = "";
    /*
    ## JS and HTML Injection
      There are a bunch of methods to inject text or HTML into a document using JS
      Mainly, they're considered "unsafe" because they can spoof a page pretty easily
      But they're useful for starting to understand how websites work
      the usual ones are element.innerText and element.innerHTML
      Here's an article on the differences if you want to know more:
      https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
  
    ## What to do in this function
      - Accept a list of restaurant objects
      - using a .forEach method, inject a list element into your index.html for every element in the list
      - Display the name of that restaurant and what category of food it is
  */
  
    list.forEach((item) => {
      const str = `<li>${item.name}</li>`;
      target.innerHTML += str;
    });
  };
  
  function filterList(list, query) {
    return list.filter((item) => {
      if (!item.name) {return;};
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    });
  };
  
  function cutRestaurantList(list) {
    console.log("fired cut list");
  
    const numberExists = [];
  
    const range = [...Array(15).keys()];
    return newArray = range.map((item) => {
      let index = getRandomIntInclusive(0, list.length - 1);
      while (numberExists.includes(index)) {
        if (list.length == 0) {
            break;
        }
        index = getRandomIntInclusive(0, list.length);
        console.log('changing index');
      }
      numberExists.push(index);
      return list[index];
    });
  };

function initMap() {
  const carto= L.map('map').setView([38.98, -76.93], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(carto);
  return carto;
};

function markerPlace(array, map) {
  console.log("array for markers", array);

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
 
  array.forEach((item) => {
    console.log('markerPlace', item)
    const {coordinates} = item.geocoded_column_1;
    L.marker([coordinates[1], coordinates[0]]).addTo(map);
  });
};

  async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    const loadDataButton = document.querySelector('#data_load');
    const clearDataButton = document.querySelector('#data_clear');
    const generateListButton = document.querySelector('#generate');
    const textField = document.querySelector('#resto');
  
    const loadAnimation = document.querySelector('#data_load_animation');
    loadAnimation.style.display = 'none';

    generateListButton.classList.add('hidden');

    const carto = initMap();

    const storedData = localStorage.getItem('storedData');
    let parsedData = JSON.parse(storedData);
    if (parsedData?.length > 0) {
      generateListButton.classList.remove('hidden');
    }
  
    let currentList = []; // this is "scoped" to the main event function
    
    loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something    
      console.log('loading data'); 
      loadAnimation.style.display = 'inline-block';

      // Basic GET request - this replaces the form Action
      const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  
      // This changes the response from the GET into data we can use - an "object"
      const storedList = await results.json();
      localStorage.setItem('storedData', JSON.stringify(storedList));
      parsedData = storedList
  
      if (parsedData?.length > 0) {
        generateListButton.classList.remove('hidden');
      }
      
      loadAnimation.style.display = 'none';
  
      console.table(storedList); 
    });

    generateListButton.addEventListener("click", (event) => {
      console.log("generate new list");
      currentList = cutRestaurantList(parsedData);
      console.log(currentList);
      injectHTML(currentList);
      markerPlace(currentList, carto);
    });

    textField.addEventListener("input", (event) =>{
      console.log("input", event.target.value);
      const newList = filterList(currentList, event.target.value)
      console.log(newList);
      injectHTML(newList);
      markerPlace(newList, carto);
    });

    clearDataButton.addEventListener("click", (event) => {
      console.log('clear browser data');
      localStorage.clear();
      console.log("localStorage Check", localStorage.getItem("storedData"));
    });
  };
  
  
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
  