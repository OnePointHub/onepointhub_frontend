<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

defineProps<{
  isOpen: boolean
  item: KbCategory
}>()

const emit = defineEmits<{
  (e: 'submit', item: KbCategory): void
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
              class="text-gray-400 w-11 h-11 mb-3.5 mx-auto"
            />
            <p class="mb-4 text-gray-500">
              Are you sure?
            </p>
            <div class="flex flex-col items-start">
              <p class="mb-2 text-base text-gray-700">
                You are about to delete the following category:
              </p>
              <ul class="list-disc px-4 mb-4">
                <li class="font-semibold">
                  {{ item.name }}
                </li>
              </ul>
            </div>

            <div class="flex justify-center items-center space-x-4">
              <button
                type="button"
                class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200
                    hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                @click="emit('cancel')"
              >
                No, cancel
              </button>
              <button
                type="submit"
                class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700
                    focus:ring-4 focus:outline-none focus:ring-red-300"
                @click="emit('submit', item)"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
