<template>
  <main class="v-index"
  >
    <div class="v-index__projects">
      <template v-if="data">
        <nuxt-link v-for="project of projectItem"
                   :to="`/projects/${project.slug}`"
                   class="v-index__projects__project"
                   :style="{
                      width: `${project.width}px`,
                      height: `${project.height}px`,
                      left: `${project.x}px`,
                      top: `${project.y}px`
                   }"
        >
          <img :src="project.url" :alt="project.title" class="v-index__projects__project__cover">
        </nuxt-link>
      </template>
    </div>
  </main>
</template>


<script setup lang="ts">
import {type APiImageData, layoutMosaic} from "~/composables/layoutMosaic";

const projectItem = ref<APiImageData[]>([])

type CMS_API_Response_page = {
  "title": string,
  "slug": string,
  "type": CMS_API_PROJECT_type,
  "covers": CMS_API_ImageObject_default[]
}

type FetchData = CMS_API_Response & {
  result: {
    pages: CMS_API_Response_page[]
  }
}

onMounted(async () => {
  await nextTick()
  generateMosaic()
  window.addEventListener('resize', generateMosaic)
})


const {data, status} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: 'site',
    select: {
      pages: {
        query: "site.find('/projets').children",
        select: {
          title: true,
          slug: true,
          type: true,
          covers: {
            query: "page.covers.toFiles",
            select: {
              ratio: 'file.ratio',
              alt: "file.alt.value",
              tiny: 'file.resize(50, null, 10)',
              small: 'file.resize(500)',
              reg: 'file.resize(1280)',
              large: 'file.resize(1920)',
              xxl: 'file.resize(2500)',
            },
          },
        }
      }
    },
  }
})

function generateMosaic() {

  if ( !data.value ) return

  const itemsToPlace: APiImageData[] = data.value.result.pages.map(page => page.covers.map(image => {
    return {
      url: image.large.url,
      width: image.large.width,
      height: image.large.height,
      x: 0,
      y: 0,
      title: page.title,
      slug: page.slug,
      type: page.type,
    }
  })).flat()


  if (import.meta.client) {
    const mosaicWidth = document.querySelector('.v-index__projects')?.getBoundingClientRect().width || window.innerWidth
    projectItem.value = layoutMosaic(itemsToPlace, mosaicWidth).dataPositions
  } else {
    projectItem.value = itemsToPlace
  }
}


</script>


<style lang="scss" scoped>
.v-index__projects {
  position: relative;
  width: 100%;
}

.v-index__projects__project {
  position: absolute;
  user-select: none;
  box-sizing: content-box;
  padding-bottom: var(--app-gap--big);
}

.v-index__projects__project__title {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 2rem;
  font-weight: 400;
  margin: 0;
  text-align: right;
}

.v-index__projects__project__cover {
  display: block;
  width: 100%;
}

</style>
