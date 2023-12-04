export interface VariablesProps {
  userId?: string
  filters: string[]
  order?: {
    field: string
    direction: string
  }
  searchString?: string
}
