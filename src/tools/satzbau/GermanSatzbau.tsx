import CategoryCardsTool from '../../components/CategoryCardsTool'
import { categories } from './data'

export default function GermanSatzbau() {
  return (
    <CategoryCardsTool
      eyebrow="Satzbau · Sentence Structure"
      title="Word Order & Patterns"
      categories={categories}
      term={(item) => item.pattern}
    />
  )
}
