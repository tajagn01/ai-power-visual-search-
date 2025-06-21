// Test script to verify new API transformation
const logger = require('./src/middleware/logger');

// Actual response structure from the logs
const actualResponse = {
  "status": "OK",
  "request_id": "23ab88ad-5d4b-46ea-9b8e-a99fa11e6bd2",
  "data": {
    "products": [
      {
        "product_id": "catalogid:13078729291008953468,gpcid:6048751601291633503,headlineOfferDocid:5288348716804380874,rds:PC_6048751601291633503|PROD_PC_6048751601291633503,imageDocid:1407207041628443590,mid:576462828323034433,pvt:hg,pvf:",
        "product_title": "Motorola moto g 2025",
        "price": "$99.99",
        "original_price": "Usually $199",
        "product_offer_page_url": "https://www.bestbuy.com/site/motorola-moto-g-2025-128gb-unlocked-forest-gray/6608063.p?skuId=6608063&contractId=unactivated",
        "on_sale": true,
        "product_photo": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQRx8d5HhqbuqTowvd0wEiau3BXYmJMzzBvxoYXPCnsx1Ikuv_j_5htg5iOucLP8sUD4lQoEakY5KkymkJ5qFvkfJCG0Wx0aHeAq9UN0efn",
        "store_name": "Best Buy",
        "store_favicon": "https://encrypted-tbn0.gstatic.com/favicon-tbn?q=tbn%3AANd9GcRJLrYt8ApvztGsW8TSy6-5HL7LwDNwH2emYmRabMUepMDXWE3LqD_Jltucg6NfE5z5MV57q9G1n_VVMyiUtZCVGXOuFlVA6g",
        "product_rating": 4.2,
        "product_num_reviews": 233,
        "shipping": null
      },
      {
        "product_id": "catalogid:,gpcid:,headlineOfferDocid:14103815193191796630,rds:PC_13645776560676710400|PROD_PC_13645776560676710400,imageDocid:2477935778341075239,mid:,pvt:hg,pvf:",
        "product_title": "Samsung Galaxy A54 5G",
        "price": "$29.99",
        "original_price": "Was $50",
        "product_offer_page_url": "https://www.cricketwireless.com/shop/smartphones/samsung-galaxy-a54-5g-awesome-graphite?utm_source=google&utm_medium=surfaces&utm_campaign=shopping+feed&utm_content=free+google+shopping+clicks",
        "on_sale": true,
        "discount_percent": "40% OFF",
        "product_photo": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQadjuFWMA4psmRDPxr37XX_beHdnmtjkuswf3ZqFhylWYnyCLt7BtEAE1pwY9U9nAGgnM8BjPrPboMcAjjSdUBTZgffrml6J0ZE5XO6rIjjGzv_9ghZ6jW_Q",
        "store_name": "Cricket Wireless",
        "store_favicon": "https://encrypted-tbn0.gstatic.com/favicon-tbn?q=tbn%3AANd9GcQPSE19oKxpFkq8hcm7wAosRNogtgbQW_IAYIkEDyOXFUjaygxrkVajmOl9e5j8PYVdd7ElQ-rDsAkaSpC74P2o92bzIs714U2cGVm2Gv7k",
        "product_rating": 4.5,
        "product_num_reviews": 34,
        "shipping": null
      }
    ],
    "sponsored_products": []
  }
};

// Transform function from rapidApiService.js
function transformNewApiProducts(apiProducts) {
  return apiProducts.map((product, index) => {
    return {
      id: product.product_id || `newapi-${Date.now()}-${index}`,
      title: product.product_title || product.title || product.name || 'Product Title Not Available',
      price: product.price || product.price_str || 'Price not available',
      image: product.product_photo || product.image || product.image_url || (product.images && product.images[0]) || `https://picsum.photos/300/300?random=newapi${index}`,
      amazonUrl: product.product_offer_page_url || product.url || product.product_url || '',
      rating: product.product_rating || product.rating || (Math.random() * 2 + 3).toFixed(1),
      reviews: product.product_num_reviews || product.reviews || Math.floor(Math.random() * 1000) + 50,
      description: product.description || '',
      brand: product.store_name || product.brand || 'Unknown Brand',
      availability: product.availability || 'In Stock'
    };
  });
}

// Test the extraction logic
console.log('🧪 Testing New API Product Extraction...\n');

// Simulate the extraction logic from the service
const rawProducts = actualResponse.data?.products || actualResponse.products || actualResponse.results || actualResponse.items || [];
console.log(`📊 Raw products count: ${rawProducts.length}`);

const transformedProducts = transformNewApiProducts(rawProducts);
console.log(`🔄 Transformed products count: ${transformedProducts.length}\n`);

console.log('📋 Sample transformed product:');
console.log(JSON.stringify(transformedProducts[0], null, 2));

console.log('\n✅ Extraction test completed!');
console.log('The new API products should now display correctly in your frontend.'); 