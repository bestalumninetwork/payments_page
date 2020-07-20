// ex: set tabstop=8 softtabstop=0 expandtab shiftwidth=2 smarttab:

// Replace with your own publishable key: https://dashboard.stripe.com/test/apikeys
var PUBLISHABLE_KEY = "pk_live_J8QXCZI8ZNI1SJiAi3uL87Qn00Je3GYNBD";
// Replace with the domain you want your users to be redirected back to after payment
var DOMAIN = window.location.origin;
// Replace with a SKU for your own product (created either in the Stripe Dashboard or with the API)
var SUBSCRIPTION_BASIC_PRICE_ID = "price_1GtvsrDDjeVyMH3ri4sUf0TD";

var stripe = Stripe(PUBLISHABLE_KEY);

var handleResult = function (result) {
  if (result.error) {
    var displayError = document.getElementById("error-message");
    displayError.textContent = result.error.message;
  }
};

var redirectToCheckout = function (priceId, priceMode) {
  // Make the call to Stripe.js to redirect to the checkout page
  // with the current quantity
  stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      successUrl:
        DOMAIN + "/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancelUrl: DOMAIN + "/canceled.html",
      mode: priceMode
    })
    .then(handleResult);
}

// Request the data.json file
fetch(new Request('data.json'))
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(response => {
    var products = response;

    var mainElement = document.getElementById('containers');
    for (product of products) {
      var newProductSection = document.createElement('section');
      newProductSection.className = "container";

      var content = document.createElement('div');
      var title = document.createElement('h1');
      title.innerText = product.name;
      content.appendChild(title);

      var preText = document.createElement('h4');
      if (product.caption) {
        preText.innerText = product.caption;
        content.appendChild(preText);
      }

      var imagePlaceholder = document.createElement('div');
      for (image of product.images) {
        _image = document.createElement('img');
        _image.setAttribute('src', image);
        _image.setAttribute('width', 140);
        _image.setAttribute('height', 160);
        imagePlaceholder.appendChild(_image);
      }
      content.appendChild(imagePlaceholder);

      var descriptionText = document.createElement('div');
      descriptionText.innerText = product.description;
      content.appendChild(descriptionText);

      newProductSection.appendChild(content);

      for (price of product.prices) {
        var button = document.createElement('button');
        var buttonText = price.unit_amount_decimal.slice(0, -2) + '.' + price.unit_amount_decimal.slice(-2) + ' ' + price.currency.toUpperCase();
        if (price.recurring) {
            buttonText += ' per ' + price.recurring.interval;
        }

        button.innerText = buttonText;
        button.id = price.id;
        if (price.type == 'recurring') {
          button.value = 'subscription'
        }
        if (price.type == 'one_time') {
          button.value = 'payment'
        }

        button.addEventListener("click", function (evt) {
          redirectToCheckout(evt.target.id, evt.target.value);
        })

        newProductSection.appendChild(button);
      }

      mainElement.appendChild(newProductSection);

    }
  }).catch(error => {
    console.error(error);
  }
);
