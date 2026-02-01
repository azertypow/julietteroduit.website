<template>
  <nuxt-link :to="`/projects/${project.slug}`"
             class="v-project"
             @mouseenter="onMouseEnter"
             @mouseleave="onMouseLeave"
             @mousemove="onMouseMove"
  >
    <img :src="project.url" :alt="project.title" class="v-index__projects__project__cover">

    <img class="v-project-list-item__miniature"
         v-if="project.miniature && isHovering"
         :src="project.miniature"
         :style="{ left: `${mouseX}px`, top: `${mouseY}px` }"
    >
  </nuxt-link>
</template>


<script setup lang="ts">
import {defineProps} from 'vue'
import type {APiImageData} from "~/composables/layoutMosaic";

defineProps<{
  project: APiImageData
}>()

const isHovering = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)

function onMouseEnter() {
  isHovering.value = true
}

function onMouseLeave() {
  isHovering.value = false
  console.log('leave')
}

function onMouseMove(event: MouseEvent) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}
</script>


<style lang="scss" scoped>
.v-project {
  width: 100%;
  height: 100%;
  position: relative;
}

.v-index__projects__project__cover {
  display: block;
  width: 100%;
  height: 100%;
}

.v-project-list-item__miniature {
  position: fixed;
  display: block;
  pointer-events: none;
  height: 33vh;
  width: auto;
  z-index: 0;
}
</style>
