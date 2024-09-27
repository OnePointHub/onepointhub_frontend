<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['sanctum:auth'],
})
</script>

<template>
  <h1>Hello World!</h1>
</template>
