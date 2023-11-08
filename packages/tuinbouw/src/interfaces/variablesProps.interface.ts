export interface VariablesProps {
  filters: string[]
  order?: {
    field: string
    direction: string
  }
  searchString?: string
}
