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
    price: 20.00,
    category: 'casual'
  },
  {
    id: 4,
    name: 'Blue jeans',
    image: 'casual1.jpeg',
    price: 59.65,
    category: 'casual'
  },
  //summer:
  {
    id: 9,
    name: 'Long green dress',
    image: 'summer1.jpeg',
    price: 251.30,
    category: 'summer'
  },
  {
    id: 10,
    name: 'Colorful mini dress',
    image: 'summer2.jpeg',
    price: 789.00,
    category: 'summer'
  },
  {
    id: 10,
    name: 'Floral open back dress',
    image: 'summer3.jpeg',
    price: 349.00,
    category: 'summer'
  },
  {
    id: 11,
    name: 'Mini blue floral dress',
    image: 'summer4.jpeg',
    price: 189.00,
    category: 'summer'
  },
  {
    id: 12,
    name: 'Long white dress',
    image: 'summer5.jpeg',
    price: 89.99,
    category: 'summer'
  },
  //nightout:
  {
    id: 1,
    name: 'Black corsette',
    image: 'nightout1.jpeg',
    price: 49.95,
    category: 'nightout'
  },
  {
    id: 5,
    name: 'Black leather pants',
    image: 'nightout2.jpeg',
    price: 59.99,
    category: 'nightout'
  },
  {
    id: 7,
    name: 'Striped pants',
    image: 'nightout3.jpeg',
    price: 65.00,
    category: 'nightout'
  },
  {
    id: 13,
    name: 'Embroidered top',
    image: 'nightout4.jpeg',
    price: 128.00,
    category: 'nightout'
  },
  {
    id: 14,
    name: 'Silver top',
    image: 'nightout5.jpeg',
    price: 52.00,
    category: 'nightout'
  },
  //vintage:
  {
    id: 3,
    name: 'Vintage leather jacket',
    image: 'vintage2.jpeg',
    price: 218.00,
    category: 'vintage'
  },
  {
    id: 2,
    name: 'Cowboy boots',
    image: 'vintage1.jpeg',
    price: 169.99,
    category: 'vintage'
  },
  {
    id: 6,
    name: 'Vintage jean skirt',
    image: 'vintage3.jpeg',
    price: 99.00,
    category: 'vintage'
  }
];

let listCards = [];

function initApp() {
  // products.forEach((value, key) => {
  //   let newDiv = document.createElement('div');
  //   newDiv.classList.add('item');
  //   newDiv.innerHTML = `
  //     <img src="static/image/${value.image}" alt="${value.name}">
  //     <div class="title">${value.name}</div>
  //     <div class="price">${value.price.toLocaleString()}</div>
  //     <button onclick="addToCard(${key})">Add To Cart</button>`;
  //   list.appendChild(newDiv);
  // });

  const categories = {
    casual: [],
    summer: [],
    nightout: [],
    vintage: []
  };

  //separating the products into their respective categories
  products.forEach((product) => {
    categories[product.category.toLowerCase()].push(product);
  });

  //iterating through each category and creates a section for each
  Object.entries(categories).forEach(([category, categoryProducts]) => {
    //creating a new section
    const section = document.createElement('section');
    section.classList.add('category-section');

    //creating an anchor tag for linking to the category section
    const categoryLink = document.createElement('a');
    categoryLink.innerHTML = '<h2>' + category + '</h2>';
    section.appendChild(categoryLink);

    //setting an id for the section to be used in the href attribute
    section.id = 'category-' + category;

    categoryProducts.forEach((product, key) => {
      let newDiv = document.createElement('div');
      newDiv.classList.add('item');
      newDiv.innerHTML = `
        <img src="static/image/${product.image}" alt="${product.name}">
        <div class="title">
          <a href="${getProductLink(product.name)}">${product.name}</a>
        </div>
        <div class="price">${product.price.toLocaleString()}</div>
        <button onclick="addToCard(${key})">Add To Cart</button>`;
      section.appendChild(newDiv);
    });

    list.appendChild(section);
  });
}

//initApp();

function addToCard(key) {
  if (listCards[key] == null) {
    listCards[key] = JSON.parse(JSON.stringify(products[key]));
    listCards[key].quantity = 1;
  } else {
    listCards[key].quantity += 1; // Increase the quantity of the existing item in the cart
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

initApp();

  