<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

defineProps<{
  isOpen: boolean
  item: KbCategory
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

function clickOutside() {
  emit('cancel')
}
</script>

<template>
  <teleport to="body">
    <div v-if="isOpen" class="fixed top-0 left-0 z-50 h-screen w-full bg-black/50">
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
            <Icon
              name="mdi:trash"
              class="text-gray-500 w-11 h-11 mb-3.5 mx-auto"
            />
            <p class="mb-4 text-gray-500">
              Warning
            </p>
            <div class="flex flex-col items-start">
              <p class="mb-2 text-base text-main">
                Category <strong>{{ item.name }}</strong> has <strong>{{ item.articles_count }}</strong>
                articles in it.
              </p>
              <p class="mb-2 text-base text-gray-600">
                Please remove them before deleting this category.
              </p>
            </div>

            <div class="flex justify-center items-center space-x-4">
              <button
                type="button"
                class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200
                  hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                @click="emit('cancel')"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
