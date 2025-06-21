import React from 'react'
import ProductCard from './ProductCard'

const ProductGrid = ({ products, theme }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          No products found
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.asin || product.id} product={product} theme={theme} />
      ))}
    </div>
  )
}

export default ProductGrid 