<template>
  <nuxt-link :to="`/projects/${project.slug}`"
             class="v-project"
             @mouseenter="onMouseEnter"
             @mouseleave="onMouseLeave"
             @mousemove="onMouseMove"

  >
    <img :src="project.url"
         :alt="`projet ${project.title}`"
         class="v-index__projects__project__cover"
         ref="projectElement"
    >

    <img class="v-project-list-item__miniature"
         :alt="`miniature pour le projet ${project.title}`"
         v-if="project.miniature && isHovering"
         ref="miniature"
         :src="project.miniature"
         :style="{ left: `${mouseX}px`, top: `${mouseY}px` }"
         @load="miniatureLoaded"
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
const projectElement = useTemplateRef('projectElement')
const miniature = useTemplateRef('miniature')
const miniatureWidth = ref(0)
const miniatureHeight = ref(0)

function miniatureLoaded() {
  nextTick(() => {
    const imageBox = miniature.value?.getBoundingClientRect()

    if( !imageBox ) return
    miniatureWidth.value = imageBox.width
    miniatureHeight.value = imageBox.height
  })
}

function onMouseEnter() {

  const imageBox = projectElement.value?.getBoundingClientRect()

  if( imageBox ) {
    mouseX.value = imageBox.left + imageBox.width / 2
    mouseY.value = imageBox.top + imageBox.height / 2
  }

  isHovering.value = true
}

function onMouseLeave() {
  isHovering.value = false
  console.log('leave')
}

function onMouseMove(event: MouseEvent) {
  mouseX.value = (event.clientX + miniatureWidth.value >= window.innerWidth)    ? event.clientX - miniatureWidth.value : event.clientX
  mouseY.value = (event.clientY + miniatureHeight.value >= window.innerHeight)  ? event.clientY - miniatureHeight.value : event.clientY
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
  z-index: 10;
  transition: all 1s cubic-bezier(0, 0, 0, 1);
}
</style>
