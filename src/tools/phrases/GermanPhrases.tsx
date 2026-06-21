import CategoryCardsTool from '../../components/CategoryCardsTool'
import { categories } from './data'

export default function GermanPhrases() {
  return (
    <CategoryCardsTool
      eyebrow="Redemittel · Useful Phrases"
      title="Connectors & Strategies"
      categories={categories}
      term={(item) => item.phrase}
    />
  )
}
