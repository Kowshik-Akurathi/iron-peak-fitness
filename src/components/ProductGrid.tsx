import type { Product } from '../types'
import { ProductCard } from './ProductCard'
export function ProductGrid({ products }: { products: Product[] }) { return products.length ? <div className="store-product-grid">{products.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="empty-products"><span className="eyebrow">Nothing matched</span><h2 className="display">No products found</h2><p>Try a different search or clear your active filters to see the full edit.</p></div> }
