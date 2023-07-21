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
  //summer:
  {
    id: 9,
    name: 'Long green dress',
    image: 'summer1.jpeg',
    price: 251.30
  },
  {
    id: 10,
    name: 'Colorful mini dress',
    image: 'summer2.jpeg',
    price: 789.00
  },
  {
    id: 10,
    name: 'Floral open back dress',
    image: 'summer3.jpeg',
    price: 349.00
  },
  {
    id: 11,
    name: 'Mini blue floral dress',
    image: 'summer4.jpeg',
    price: 189.00
  },
  {
    id: 12,
    name: 'Long white dress',
    image: 'summer5.jpeg',
    price: 89.99
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
  if (productName === 'Long green dress') {
    return 'https://savannahmorrow.com/products/jaya-dress-agave';
  } 
  if (productName === 'Colorful mini dress') {
    return 'https://www.davidjones.com/Product/25827125';
  }
  if (productName === 'Floral open back dress') {
    return 'https://us.needleandthread.com/products/sunrise-bloom-backless-cotton-micro-mini-dress-moonshine?epik=dj0yJnU9MnhzOVJNMEJEYzhnXzVpdnlpcjB4ZnZRM2o1UDNxekkmcD0wJm49MkNxeHI5dmlYeXBPLTZmLXBBeE5OQSZ0PUFBQUFBR1M0RlJB';
  }
  if (productName === 'Mini blue floral dress') {
    return 'https://www.usa.bardot.com/product/lila-flounce-dress-58061DB_WATER+FLRL.html';
  }
  if (productName === 'Long white dress') {
    return 'https://lichi.com/ww/en/product/43137?ssp_iabi=1683999469025';
  }
  else {
    // Provide fallback links for other products if needed
    return '#'; // Replace '#' with the default link
  }
}


  