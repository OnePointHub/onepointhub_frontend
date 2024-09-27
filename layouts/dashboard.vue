<script setup lang="ts">
import Navbar from '~/layouts/components/dashboard/navbar.vue'
import Sidebar from '~/layouts/components/dashboard/sidebar.vue'
</script>

<template>
  <div>
    <Navbar />
    <Sidebar />

    <div class="p-4 sm:ml-64">
      <div class="p-4 mt-14">
        <slot />
      </div>
    </div>
  </div>
</template>
