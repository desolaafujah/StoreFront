let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let registerButton = document.querySelector('.registerButton');

openShopping.addEventListener('click', () => {
  body.classList.add('active');
});

closeShopping.addEventListener('click', () => {
  body.classList.remove('active');
});

let products = [
  //nightout:
  {
    id: 1,
    name: 'Black corsette',
    image: 'nightout1.jpeg',
    price: 49.95,
  },
  {
    id: 5,
    name: 'Black leather pants',
    image: 'nightout2.jpeg',
    price: 59.99
  },
  {
    id: 7,
    name: 'Striped pants',
    image: 'nightout3.jpeg',
    price: 65.00
  },
  {
    id: 13,
    name: 'Embroidered top',
    image: 'nightout4.jpeg',
    price: 128.00
  },
  {
    id: 14,
    name: 'Silver top',
    image: 'nightout5.jpeg',
    price: 52.00
  }
];

let listCards = [];

function initApp() {
  products.forEach((value, key) => {
    let newDiv = document.createElement('div');
    newDiv.classList.add('item');
    newDiv.innerHTML = `
      <img src="static/image/${value.image}" alt="${value.name}">
      <div class="title">${value.name}</div>
      <div class="price">${value.price.toLocaleString()}</div>
      <button onclick="addToCard(${key})">Add To Cart</button>`;
    list.appendChild(newDiv);
  });
}

initApp();

function addToCard(key) {
  if (listCards[key] == null) {
    listCards[key] = JSON.parse(JSON.stringify(products[key]));
    listCards[key].quantity = 1;
  }
  reloadCard();

  // Send an AJAX request to update the server-side data
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/update_cart', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Handle the response from the server if needed
      console.log(xhr.responseText);
    }
  };
  const data = JSON.stringify(listCards);
  xhr.send(data);
}

function reloadCard() {
  listCard.innerHTML = '';
  let count = 0;
  let totalPrice = 0;
  listCards.forEach((value, key) => {
    if (value != null) {
      totalPrice += value.price;
      count += value.quantity;
      let newDiv = document.createElement('li');
      newDiv.innerHTML = `
        <div><img src="static/image/${value.image}" alt="${value.name}"></div>
        <div>${value.name}</div>
        <div>${value.price.toLocaleString()}</div>
        <div>
          <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
          <div class="count">${value.quantity}</div>
          <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
        </div>`;
      listCard.appendChild(newDiv);
    }
  });
  total.innerText = totalPrice.toLocaleString();
  quantity.innerText = count;

  // Send an AJAX request to update the server-side data
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/update_cart', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Handle the response from the server if needed
      console.log(xhr.responseText);
    }
  };
  const data = JSON.stringify(listCards);
  xhr.send(data);
}

function changeQuantity(key, quantity) {
  if (quantity == 0) {
    delete listCards[key];
  } else {
    listCards[key].quantity = quantity;
    listCards[key].price = quantity * products[key].price;
  }
  reloadCard();

  // Send an AJAX request to update the server-side data
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/update_cart', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Handle the response from the server if needed
      console.log(xhr.responseText);
    }
  };
  const data = JSON.stringify(listCards);
  xhr.send(data);
}


  
function initApp() {
  products.forEach((value, key) => {
    let newDiv = document.createElement('div');
    newDiv.classList.add('item');
    newDiv.innerHTML = `
      <img src="static/image/${value.image}" alt="${value.name}">
      <div class="title">
        <a href="${getProductLink(value.name)}">${value.name}</a>
      </div>
      <div class="price">${value.price.toLocaleString()}</div>
      <button onclick="addToCard(${key})">Add To Cart</button>`;
    list.appendChild(newDiv);
  });
}

function getProductLink(productName) {
  // Replace this function with your logic to generate the correct link for each product name
  // Example: if the product name is "Long green dress", you want the link to be "https://savannahmorrow.com/products/jaya-dress-agave"
  // Modify the logic based on how your product URLs are structured
  if (productName === 'Black corsette') {
    return 'https://www.showpo.com/us/vaira-strapless-corset-top-in-black.html';
  }
  if (productName === 'Black leather pants') {
    return 'https://www.nordstrom.com/s/franklin-high-waist-faux-leather-wide-leg-pants/7365895?origin=keywordsearch-personalizedsort&breadcrumb=Home%2FAll%20Results&color=001';
  }
  if (productName === 'Striped pants') {
    return 'https://us.princesspolly.com/products/archer-pants-pinstripe-grey-petite?currency=USD&variant=39751561576532&utm_medium=cpc&utm_source=google&utm_campaign=Google%20Shopping&utm_source=cpc&utm_medium=google&utm_term=&adid=&matchtype=&addisttype=xpla&tw_source=google&tw_adid=&tw_campaign=19750607918&gclid=CjwKCAjwtuOlBhBREiwA7agf1pm79rI9QtfgJsGEto80zWugs5ymvv_sWcLAy4bBclda6JgWRdR5MxoCOaYQAvD_BwE';
  }
  if (productName === 'Embroidered top') {
    return 'https://www.freepeople.com/shop/florence-top2/?color=001&countryCode=US&gclid=CjwKCAjwtuOlBhBREiwA7agf1ogt3ykN4maUQrmVHLEoWFZvw2N4qvTdwaSDnf3IVEJsbR65eZLCQBoCuL8QAvD_BwE&gclsrc=aw.ds&inventoryCountry=US&size=M&utm_kxconfid=vx6ro62gj&type=REGULAR&quantity=1';
  }
  if (productName === 'Silver top') {
    return 'https://us.motelrocks.com/products/pratiba-top-silver';
  }
  else {
    // Provide fallback links for other products if needed
    return '#'; // Replace '#' with the default link
  }
}


  