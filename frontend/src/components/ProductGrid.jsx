import React from 'react'
import ProductCard from './ProductCard'

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-400">No products found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 px-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product, index) => (
        <ProductCard key={`${product.id}-${index}`} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid 