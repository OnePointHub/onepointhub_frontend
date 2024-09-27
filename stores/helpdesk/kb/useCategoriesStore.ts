interface Category {
  id: number
  name: string
  slug: string
  articles_count: number
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
  }),
  getters: {
    getCategories: state => state.categories,
  },
  actions: {
    async fetchCategories() {
      const client = useSanctumClient()
      try {
        const response = await client('/api/v1/helpdesk/categories')
        this.categories = response.data
        return response
      }
      catch (error) {
        console.error('Error fetching todos: ', error)
      }
    },
    async deleteCategory(item: Category) {
      const client = useSanctumClient()
      try {
        const res = await client.raw(`/api/v1/helpdesk/categories/${item.slug}`, {
          method: 'DELETE',
        })
        this.fetchCategories()
        return res.status
      }
      catch (error) {
        console.error('Error deleting category: ', error)
      }
    },
    async createCategory(name: any) {
      const client = useSanctumClient()
      try {
        const res = await client.raw('/api/v1/helpdesk/categories', {
          method: 'POST',
          body: {
            name,
          },
        })
        this.fetchCategories()
        return res.status
      }
      catch (e) {
        const error = useApiError(e)

        if (error.isValidationError) {
          return [422, error.bag]
        }
        console.error('Error creating category: ', error)
      }
    },
    async editCategory(category: KbCategory) {
      const client = useSanctumClient()
      try {
        const res = await client.raw(`/api/v1/helpdesk/categories/${category.slug}`, {
          method: 'PUT',
          body: {
            name: category.name,
          },
        })
        this.fetchCategories()
        return res.status
      }
      catch (e) {
        const error = useApiError(e)

        if (error.isValidationError) {
          return [422, error.bag]
        }
        console.error('Error creating category: ', error)
      }
    },
  },
})
