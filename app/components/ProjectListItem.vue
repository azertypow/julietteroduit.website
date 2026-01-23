<template>
    <section class="v-project-list-item"
    >
      <div class="v-project-list-item__title" >{{title}}</div>
      <div class="v-project-list-item__client" >{{client}}</div>
      <div class="v-project-list-item__year" >
        <div>
          {{ new Date(date).getFullYear() }}
        </div>
      </div>
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  title: string
  client: string
  date: string
}>()
</script>





<style lang="scss" scoped >
.v-project-list-item {
  display: flex;
  width: 100%;
  gap: var(--app-gap);
}

.v-project-list-item__title {
  width: calc(100% / 12 * 6);
}
.v-project-list-item__client {
  width: calc(100% / 12 * 4);
}
.v-project-list-item__year {
  display: flex;
  width: calc(100% / 12 * 2);
  justify-content: flex-end;
  flex-direction: column;
}
</style>
