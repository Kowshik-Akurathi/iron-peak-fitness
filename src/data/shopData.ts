import type { ProductCategory, ProductStock } from '../types'
export const categories: Array<'All' | ProductCategory> = ['All', 'Protein', 'Pre-Workout', 'Creatine', 'Vitamins', 'Protein Snacks', 'Accessories', 'Equipment', 'Fitness Wear']
export type ShopFilters = { brands: string[]; maxPrice: number; minRating: number; availability: ProductStock | 'All' }
export const defaultFilters: ShopFilters = { brands: [], maxPrice: 5000, minRating: 0, availability: 'All' }
