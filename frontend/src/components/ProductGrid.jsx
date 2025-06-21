import React from 'react'
import ProductCard from './ProductCard'

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return null; // The parent component now handles the empty state message
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.asin || product.id} product={product} index={index} />
      ))}
    </div>
  )
}

export default ProductGrid 