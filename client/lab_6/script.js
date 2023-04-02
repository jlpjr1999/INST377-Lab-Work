
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
  /*
    Using the .filter array method, 
    return a list that is filtered by comparing the item name in lower case
    to the query in lower case

    Ask the TAs if you need help with this
  */
  return list.filter((item) => {
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

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  // Add a querySelector that targets your filter button here
  const filterButton = document.querySelector('#filter');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('#generate');

  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = 'none';

  let currentList = []; // this is "scoped" to the main event function
  
  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something    
    console.log('loading data'); 
    loadAnimation.style.display = 'inline-block';

    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    // This changes the response from the GET into data we can use - an "object"
    currentList = await results.json();

    loadAnimation.style.display = 'none';

    console.table(currentList); 
  });


  /*
    Now that you HAVE a list loaded, write an event listener set to your filter button
    it should use the 'new FormData(target-form)' method to read the contents of your main form
    and the Object.fromEntries() method to convert that data to an object we can work with

    When you have the contents of the form, use the placeholder at line 7
    to write a list filter

    Fire it here and filter for the word "pizza"
    you should get approximately 46 results
  */
  filterButton.addEventListener('click', (event) => {
    console.log("clicked filter button");

    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);

    const newList = filterList(currentList, formProps.resto);
    injectHTML(newList);
    console.log(newList);
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    const restaurantsList = cutRestaurantList(currentList);
    injectHTML(restaurantsList);
  });
}


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
