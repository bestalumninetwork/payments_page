#!/usr/bin/env python3
# ex: set tabstop=8 softtabstop=0 expandtab shiftwidth=2 smarttab:

import stripe
import json
from pprint import pprint
import os
import sys
from time import sleep

wait_sec       = int(os.environ.get('STRIPE_WAIT_SEC', 300))
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
if not stripe.api_key:
  sys.exit(1)

while True:
  # Get a list of all our products
  products = stripe.Product.list()['data']

  # Filter out all non-active products
  products_filtered = [{
      "active":           product['active'],
      "attributes":       product['attributes'],
      "caption":          product.get('caption'),
      "description":      product['description'],
      "id":               product['id'],
      "images":           product['images'] if product['images'] else ['image/no_image_192x192.png'],
      "name":             product['name'],
      "type":             product["type"]
    } for product in products if product['active']]

  # Retriving prices for the products 
  for product in products_filtered:
    product['prices'] = [{
        "currency":               price['currency'],
        "id":                     price['id'],
        "recurring":              price['recurring'],
        "type":                   price['type'],
        "unit_amount":            price['unit_amount'],
        "unit_amount_decimal":    price["unit_amount_decimal"]
      }
      # retrice prices for the current product
      for price in stripe.Price.list()['data'] if price['product'] == product['id']
    ]

  # Retriving prices (SKU) for the products
  for product in products_filtered:
    # This is need in order not to overwrite an initialize product['price'] with []
    if not product['prices']:
      product['prices'] = [{
          "currency":               price['currency'],
          "id":                     price['id'],
          "recurring":              None,
          "type":                   "one_time",
          "unit_amount":            price['price'],
          "unit_amount_decimal":    str(price["price"])
        }
        # retrice prices for the current product
        for price in stripe.SKU.list()['data'] if price['product'] == product['id']
      ]

  # Print json object
  #print(json.dumps(products_filtered, indent=2, sort_keys=True))

  with open('/website/data.json', 'w') as f:
    f.write(json.dumps(products_filtered, indent=2, sort_keys=True))

  print('Updated /website/data.json')
  sleep(wait_sec)

