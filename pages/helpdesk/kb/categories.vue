<script setup lang="ts">
import { toast } from 'vue3-toastify'
import CreateModal from '~/components/helpdesk/kb/categories/CreateModal.vue'
import DeleteModal from '~/components/helpdesk/kb/categories/DeleteModal.vue'
import EditModal from '~/components/helpdesk/kb/categories/EditModal.vue'
import RestrictDeleteModal from '~/components/helpdesk/kb/categories/RestrictDeleteModal.vue'
import { useCategoriesStore } from '~/stores/helpdesk/kb/useCategoriesStore'

definePageMeta({
  layout: 'dashboard',
  middleware: ['sanctum:auth'],
})

/* Const Declaration */
// Fetch categories from server
const categoryStore = useCategoriesStore()
const paginatedData = ref()
// Sort Data
const currentSort = ref('id')
const currentSortDir = ref('asc')
// Pagination
const page = ref(1)
const perPage = 12
const first = ref(getFirst())
const last = ref(getLast())
// Select All
const selectedAll = ref(false)
const selected: Ref<Array<any[]> | any[]> = ref([])
// Search Data
const searchValue = ref('')
// Create Modal
const isCreateOpen = ref(false)
// Edit Modal
const isEditOpen = ref(false)
// Delete Modal
const isDeleteModalOpened = ref(false)
const isRestrictModalOpened = ref(false)
const modalCategory = ref()

/* Fetch categories from server */
onMounted(async () => {
  await categoryStore.fetchCategories()
})

onBeforeMount(() => {
  paginatedData.value = getPaginatedData()
})

/* Delete Modal */
function openModal(category: any) {
  modalCategory.value = category
  if (category.articles_count > 0) {
    isRestrictModalOpened.value = true
  }
  if (category.articles_count === 0) {
    modalCategory.value = category
    isDeleteModalOpened.value = true
  }
}

function closeModal() {
  isDeleteModalOpened.value = false
  isRestrictModalOpened.value = false
}

async function handleSubmit(item: any) {
  const res = await categoryStore.deleteCategory(item)
  if (res === 200) {
    toast.success(`Category ${item.name} deleted successfully.`)
  }
  else {
    toast.error('An error occurred.')
  }
  closeModal()
}

/* Create Modal */
function openCreate() {
  isCreateOpen.value = true
}

function closeCreate() {
  isCreateOpen.value = false
}

async function handleCreate(name: string) {
  const res: any = await categoryStore.createCategory(name)

  if (res === 201) {
    toast.success(`Category ${name} created successfully.`)
  }
  else if (res[0] === 422) {
    toast.error(res[1].name)
  }
  closeCreate()
}

/* Edit Modal */
function openEdit(category: KbCategory) {
  modalCategory.value = category
  isEditOpen.value = true
}

function closeEdit() {
  isEditOpen.value = false
}

async function handleEdit(item: KbCategory) {
  const res: any = await categoryStore.editCategory(item)

  if (res === 200) {
    toast.success(`Category updated successfully.`)
  }
  else if (res[0] === 422) {
    toast.error(res[1].name)
  }
  closeEdit()
}

/* Sort data */
const sortedData = computed(() => {
  return categoryStore.getCategories.slice().sort((a: any, b: any) => {
    let modifier = 1
    if (currentSortDir.value === 'desc')
      modifier = -1
    if (a[currentSort.value] < b[currentSort.value]) {
      selected.value = []
      return -1 * modifier
    }
    if (a[currentSort.value] > b[currentSort.value]) {
      selected.value = []
      return modifier
    }
    return 0
  })
})

function sort(columnToSort: any) {
  if (columnToSort === currentSort.value) {
    currentSortDir.value = currentSortDir.value === 'asc' ? 'desc' : 'asc'
  }
  else {
    currentSortDir.value = 'asc'
  }
  currentSort.value = columnToSort
}

/* Search Data */
const searchData = computed(() => {
  if (searchValue.value.length > 0) {
    return sortedData.value.filter((item) => {
      return item.name.toUpperCase().includes(searchValue.value.toUpperCase())
    })
  }
  else {
    return sortedData.value
  }
})

/* Pagination */
const totalPages = ref(Math.ceil(searchData.value.length / perPage))
const dataLength = ref(searchData.value.length)

function getFirst() {
  if (page.value === 1) {
    return 1
  }
  else {
    return 1 + (perPage * page.value) - perPage
  }
}

function getLast() {
  if (page.value === 1) {
    return perPage
  }
  else {
    if (searchData.value.length < perPage * page.value) {
      return searchData.value.length
    }
    else {
      return perPage + (perPage * page.value) - perPage
    }
  }
}

function getPaginatedData() {
  return searchData.value.slice((page.value - 1) * perPage, page.value * perPage)
}

function nextPage() {
  if (page.value !== Math.ceil(searchData.value.length / perPage)) {
    page.value++
  }
}

function backPage() {
  if (page.value !== 1) {
    page.value--
  }
}

function goToPage(numPage: any) {
  page.value = numPage
}

watch(page, () => {
  paginatedData.value = getPaginatedData()
  first.value = getFirst()
  last.value = getLast()
})

watch(searchData, () => {
  paginatedData.value = getPaginatedData()
  getLast()
  nextPage()
  totalPages.value = Math.ceil(searchData.value.length / perPage)
  dataLength.value = searchData.value.length
  page.value = 1
})

/* Select all */
function selectAll() {
  selectedAll.value = !selectedAll.value
  if (selectedAll.value) {
    selected.value = []
    for (const i in paginatedData.value) {
      selected.value.push(paginatedData.value[i].id)
    }
  }
  else {
    selected.value = []
  }
}

function updateSelectAll() {
  if (selected.value.length === paginatedData.value.length) {
    selectedAll.value = true
  }
}

watch(selected, () => {
  if (selected.value.length < paginatedData.value.length) {
    selectedAll.value = false
  }
}, { deep: true })
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
      <label for="table-search" class="sr-only">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
          <Icon
            name="mdi-magnify"
            class="w-6 h-6 text-gray-500"
          />
        </div>
        <input
          id="table-search"
          v-model="searchValue"
          type="text"
          class="border text-sm rounded-lg focus:outline-none focus:border-2 block w-48 p-2 ps-10 text-main
            border-secondary bg-background focus:border-primary"
          placeholder="Search for items"
        >
      </div>
      <div>
        <button
          class="w-48 flex items-center justify-center space-x-1 bg-secondary hover:bg-primary text-white rounded-lg py-2"
          @click="openCreate"
        >
          <Icon name="mdi-plus" class="w-6 h-6" />
          <span>Create new category</span>
        </button>
      </div>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="first:p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all"
                v-model="selectedAll"
                type="checkbox"
                class="w-4 h-4 accent-primary"
                @click="selectAll"
              >
              <label for="checkbox-all" class="sr-only">Checkbox</label>
            </div>
          </th>
          <th scope="col" class="first:p-4 px-6 py-3" @click="sort('id')">
            <button
              class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              :class="{ 'bg-gray-300': currentSort === 'id' }"
            >
              <Icon
                v-if="currentSortDir === 'asc' && currentSort === 'id'"
                name="mdi:chevron-up"
                class="w-6 h-6"
              />
              <Icon
                v-else
                name="mdi:chevron-down"
                class="w-6 h-6"
              />
              <span>ID</span>
            </button>
          </th>
          <th scope="col" class="first:p-4 px-6 py-3" @click="sort('name')">
            <button
              class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              :class="{ 'bg-gray-300': currentSort === 'name' }"
            >
              <Icon
                v-if="currentSortDir === 'asc' && currentSort === 'name'"
                name="mdi:chevron-up"
                class="w-6 h-6"
              />
              <Icon
                v-else
                name="mdi:chevron-down"
                class="w-6 h-6"
              />
              <span>NAME</span>
            </button>
          </th>
          <th scope="col" class="first:p-4 px-6 py-3" @click="sort('articles_count')">
            <button
              class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              :class="{ 'bg-gray-300': currentSort === 'articles_count' }"
            >
              <Icon
                v-if="currentSortDir === 'asc' && currentSort === 'articles_count'"
                name="mdi:chevron-up"
                class="w-6 h-6"
              />
              <Icon
                v-else
                name="mdi:chevron-down"
                class="w-6 h-6"
              />
              <span>NUMBER OF POSTS</span>
            </button>
          </th>
          <th scope="col" class="first:p-4 px-6 py-3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(category, index) in paginatedData"
          :key="index"
          class="bg-white border-b hover:bg-gray-50"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox"
                v-model="selected"
                :value="category.id"
                type="checkbox"
                class="w-4 h-4 accent-primary"
                @change="updateSelectAll()"
              >
              <label for="checkbox" class="sr-only">Checkbox</label>
            </div>
          </td>
          <th scope="row" class="px-6 py-4 text-main font-medium whitespace-nowrap">
            {{ category.id }}
          </th>
          <th scope="row" class="px-6 py-4 text-main font-medium whitespace-nowrap capitalize">
            {{ category.name }}
          </th>
          <td class="px-6 py-4 text-main">
            {{ category.articles_count }}
          </td>
          <td class="px-6 py-4">
            <div class="flex space-x-2">
              <button
                class="text-gray-400/80 hover:text-secondary"
              >
                <Icon
                  name="mdi:pencil"
                  class="w-6 h-6"
                  @click="openEdit(category)"
                />
              </button>
              <button
                class="text-gray-400/80 hover:text-error"
              >
                <Icon
                  name="mdi:delete-forever"
                  class="w-6 h-6"
                  @click="openModal(category)"
                />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4">
      <span class="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
        Showing
        <span class="font-semibold text-main">{{ first }}-{{ last }}</span>
        of
        <span class="font-semibold text-main">{{ dataLength }}</span>
      </span>
      <ul class="inline-flex -space-x-px text-sm h-8">
        <li>
          <button
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border
              border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-main"
            @click="backPage()"
          >
            Previous
          </button>
        </li>
        <li
          v-for="item in totalPages" :key="item"
        >
          <button
            class="flex items-center justify-center px-3 h-8 leading-tight border border-gray-300"
            :class="{
              'bg-primary text-white': page === item,
              'bg-white text-gray-500 hover:bg-gray-100 hover:text-main': page !== item,
            }"
            :disabled="page === item"
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </li>
        <li>
          <button
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300
              rounded-e-lg hover:bg-gray-100 hover:text-main"
            @click="nextPage()"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
    <!-- Create Modal -->
    <CreateModal
      :is-open="isCreateOpen"
      @cancel="closeCreate"
      @submit="handleCreate"
    />
    <!-- End Create Modal -->

    <!-- Edit Modal -->
    <EditModal
      :is-open="isEditOpen"
      :category="modalCategory"
      @cancel="closeEdit"
      @submit="handleEdit"
    />
    <!-- End Edit Modal -->

    <!-- Restrict Delete Modal -->
    <RestrictDeleteModal
      :item="modalCategory"
      :is-open="isRestrictModalOpened"
      @cancel="closeModal"
    />
    <!-- End Restrict Delete Modal -->

    <!-- Delete Modal -->
    <DeleteModal
      :is-open="isDeleteModalOpened"
      :item="modalCategory"
      @cancel="closeModal"
      @submit="handleSubmit"
    />
    <!-- End Delete Modal -->
  </div>
</template>
