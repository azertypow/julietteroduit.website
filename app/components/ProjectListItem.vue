<template>
    <nuxt-link class="v-project-list-item"
               :href="`/projects/${slug}`"
    >
      <div class="v-project-list-item__title" >{{title}}</div>
      <div class="v-project-list-item__client" >{{client}}</div>
      <div class="v-project-list-item__year" >{{ new Date(date).getFullYear() }}</div>
      <img class="v-project-list-item__cover" v-if="cover" :src="cover.url">
    </nuxt-link>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  title: string
  client: string
  date: string
  slug: string
  cover?: CMS_API_Image
}>()
</script>





<style lang="scss" scoped >
.v-project-list-item {
  display: flex;
  width: 100%;
  gap: var(--app-gap);
  text-decoration: none;
  position: relative;
}

.v-project-list-item__title {
  width: calc(100% / 12 * 6);
}
.v-project-list-item__client {
  width: calc(100% / 12 * 5);
}
.v-project-list-item__year {
  width: calc(100% / 12 * 1);
  text-align: right;
}

.v-project-list-item__cover {
  position: absolute;
  top: 100%;
  left: calc(100% / 24 * 5);
  display: none;
  height: 33vh;
  z-index: 10;
  pointer-events: none;

  .v-project-list-item:hover & {
    display: block;
  }
}
</style>
