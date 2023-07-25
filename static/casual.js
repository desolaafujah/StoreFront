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
  //casual:
  {
    id: 8,
    name: 'White t-shirt',
    image: 'casual2.jpeg',
    price: 20.00
  },
  {
    id: 4,
    name: 'Blue jeans',
    image: 'casual1.jpeg',
    price: 59.69
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

// initApp();

function getProductLink(productName) {
  // Replace this function with your logic to generate the correct link for each product name
  // Example: if the product name is "Long green dress", you want the link to be "https://savannahmorrow.com/products/jaya-dress-agave"
  // Modify the logic based on how your product URLs are structured
  if (productName === 'White t-shirt') {
    return 'https://www.urbanoutfitters.com/shop/bdg-universal-shrunken-tee?inventoryCountry=US&color=010&size=XS&utm_medium=cpc&utm_source=google&utm_campaign=%5BNB%20PLA%20US%5D%20-%20PMAX%20-%20Womens%20-%20Tops&utm_content=&utm_term=&creative=&device=c&matchtype=&network=x&utm_kxconfid=vx6q4l3b6&gclid=CjwKCAjwtuOlBhBREiwA7agf1mnoViHo70iHegTYyRENT6hjr45AzEoQBnF7EFVd7sD0q-YG_n_TbhoCj-MQAvD_BwE&gclsrc=aw.ds&type=REGULAR&quantity=1';
  } 
  if (productName === 'Blue jeans') {
    return 'https://www.pacsun.com/pacsun/eco-medium-blue-dad-jeans-4701066.html?store=PACSUN-1157&country=US&currency=USD&OriginId=GOG&XCIDP=P%3AG_Shopping_PMAX_W_Bottoms+%3E+Denim&gclid=CjwKCAjwtuOlBhBREiwA7agf1nx5wFoq5Z0os9H-E0ku-UX0bW9JdudpI6qYc0e-DsTEI8Z_SfNdARoCJdwQAvD_BwE&gclsrc=aw.ds';
  }
  else {
    // Provide fallback links for other products if needed
    return '#'; // Replace '#' with the default link
  }
}




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


// function addToCard(key) {
//   // Check if the product already exists in the cart
//   let existingProductIndex = listCards.findIndex((product) => product.id === products[key].id);

//   if (existingProductIndex !== -1) {
//     // If the product exists, increase its quantity
//     listCards[existingProductIndex].quantity++;
//   } else {
//     // If the product doesn't exist, add it to the cart
//     let productToAdd = JSON.parse(JSON.stringify(products[key]));
//     productToAdd.quantity = 1;
//     listCards.push(productToAdd);
//   }

//   reloadCard();

//   // Send an AJAX request to update the server-side data (if needed)
//   // Replace '/update_cart' with the appropriate URL for your server
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', '/update_cart', true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//       // Handle the response from the server if needed
//       console.log(xhr.responseText);
//     }
//   };
//   const data = JSON.stringify(listCards);
//   xhr.send(data);
// }

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

initApp();