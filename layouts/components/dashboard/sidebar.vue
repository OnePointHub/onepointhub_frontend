<script setup lang="ts">
const showHelpdesk = ref(false)
const showKB = ref(false)

</script>

<template>
  <aside
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white
      border-r border-gray-200 sm:translate-x-0"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white">
      <ul class="space-y-2 font-medium">
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
          >
            <Icon
              name="mdi:view-dashboard"
              class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
            />
            <span class="ms-3">Dashboard</span>
          </a>
        </li>
        <li>
          <button
            @click="showHelpdesk = !showHelpdesk"
            type="button"
            class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg
              group hover:bg-gray-100"
          >
            <Icon
              name="mdi:help-box"
              class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
            />
            <span class="flex-1 ms-3 text-left whitespace-nowrap">Helpdesk</span>
            <Icon
                v-if="showHelpdesk"
              name="mdi:chevron-up"
              class="w-6 h-6"
              />
            <Icon
                v-else
                name="mdi:chevron-down"
                class="w-6 h-6"
            />
          </button>
          <ul v-if="showHelpdesk" class="py-2 space-y-2">
            <li>
              <button
                @click="showKB = !showKB"
                type="button"
                class="flex items-center w-full p-2 pl-10 text-base text-gray-900 transition duration-75 rounded-lg
                  group hover:bg-gray-100"
              >
                <span class="flex-1 ms-3 text-left whitespace-nowrap">Knowledge Base</span>
                <Icon
                    v-if="showKB"
                    name="mdi:chevron-up"
                    class="w-6 h-6"
                />
                <Icon
                    v-else
                    name="mdi:chevron-down"
                    class="w-6 h-6"
                />
              </button>
              <ul v-if="showKB" class="py-2 space-y-2">
                <li>
                  <a
                    href="#"
                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-20 group
                      hover:bg-gray-100"
                  >
                    Articles
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-20 group
                      hover:bg-gray-100"
                  >
                    Categories
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group
                  hover:bg-gray-100"
              >
                FAQs
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>
