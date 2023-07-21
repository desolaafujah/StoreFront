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
  //vintage:
  {
    id: 3,
    name: 'Vintage leather jacket',
    image: 'vintage2.jpeg',
    price: 218.00
  },
  {
    id: 2,
    name: 'Cowboy boots',
    image: 'vintage1.jpeg',
    price: 169.99
  },
  {
    id: 6,
    name: 'Vintage jean skirt',
    image: 'vintage3.jpeg',
    price: 99.00
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
  if (productName === 'Vintage leather jacket') {
    return 'https://cherishthelabel.com/collections/new-arrivals-1/products/vintage-double-collar-oversized-leather-bomber-jacket-xs-xxl';
  }
  if (productName === 'Cowboy boots') {
    return 'https://www.countryoutfitter.com/shyanne-womens-loretta-western-boots---snip-toe/2000014395.html?dwvar_2000014395_color=280#q=Cowgirl+boots&start=4';
  }
  if (productName === 'Vintage jean skirt') {
    return 'https://www.urbanoutfitters.com/shop/bdg-kendall-denim-maxi-skirt?color=093&size=XS&utm_medium=social&utm_source=pinterest&utm_campaign=organic-shopping&utm_content=WOMENS-BOTTOMS&utm_kxconfid=vx6q5cl47&epik=dj0yJnU9YjdnTWJiVWRfYUJkbm9ReUR2Y0FabHZSd3pCNVh3TEgmcD0wJm49a1UtalM5X3oteHg2MlE0N3hGNG5VdyZ0PUFBQUFBR1M0QnZv&type=REGULAR&quantity=1';
  }
  else {
    // Provide fallback links for other products if needed
    return '#'; // Replace '#' with the default link
  }
}


  