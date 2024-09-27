<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps<{
  isOpen: boolean
  category: KbCategory
}>()

const emit = defineEmits<{
  (e: 'submit', item: KbCategory): void
  (e: 'cancel'): void
}>()

const item = computed(() => props.category)

function clickOutside() {
  emit('cancel')
}
</script>

<template>
  <teleport to="body">
    <div v-if="props.isOpen" class="fixed top-0 left-0 z-50 h-screen w-full bg-black/50">
      <div class="flex justify-center items-center h-screen">
        <div v-on-click-outside="clickOutside" class="relative bg-white rounded-lg w-[400px]">
          <div class="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
            <button
              type="button"
              class="text-gray-400 absolute top-15 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg
                  text-sm p-1.5 inline-flex"
              @click="emit('cancel')"
            >
              <Icon
                name="mdi:close"
                class="w-5 h-5"
              />
              <span class="sr-only">Close modal</span>
            </button>
            <form class="p-4 md:p-5">
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label for="name" class="block mb-2 text-sm font-medium text-main">
                    Edit category
                  </label>
                  <input
                    id="name"
                    v-model="item.name"
                    name="name"
                    type="text"
                    required
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                      focus:border-primary-600 block w-full p-2.5"
                  >
                </div>
              </div>
            </form>
            <div class="flex justify-center items-center space-x-4">
              <button
                type="button"
                class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200
                    hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                @click="emit('cancel')"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700
                    focus:ring-4 focus:outline-none focus:ring-red-300"
                @click="emit('submit', item)"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
