<template>
  <main class="v-index"
  >
    <div v-if="data" class="v-index__projects app-grid__wrap">
      <template v-for="project of projectItem">
        {{project.title}}
      </template>
    </div>
  </main>
</template>


<script setup lang="ts">
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

const {data, status} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
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
}).then(res => {

  if (res.data.value) {

    const itemsToPlace: APiImageData[]  = res.data.value.result.pages.map(page => page.covers.map(image => {
      return {
        url: image.large.url,
        width: image.large.width,
        height: image.large.height,
        x: 0,
        y: 0,
        title: page.title,
        slug: page.slug,
      }
    })).flat()


    if (import.meta.client) {
      projectItem.value = layoutMosaic(itemsToPlace, window.innerWidth).dataPositions

    } else {
      projectItem.value = itemsToPlace
    }

    console.log(itemsToPlace)

  }



  return {
    data: res.data,
    status: res.status,
  }
})

</script>


<style lang="scss" scoped>
.v-index__projects {
  padding: var(--header-height) 3rem 1rem;
}

.v-index__projects__project {
  position: relative;
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
