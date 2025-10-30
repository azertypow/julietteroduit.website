<template>
  <main class="v-index"
  >
    <div v-if="data" class="v-index__projects app-grid__wrap">
      <template v-for="project of randomProjectsOrder">
        <nuxt-link class="v-index__projects__project"
                   :class="{
                    'app-grid__wrap__col-12-27':
                        project.type === 'Architecture' && cover.ratio > 1,

                    'app-grid__wrap__col-9-27':
                        project.type === 'Architecture' && cover.ratio <= 1
                        || project.type === 'Scénographie' && cover.ratio > 1,

                    'app-grid__wrap__col-7-27':
                        project.type === 'Scénographie' && cover.ratio <= 1,

                    'app-grid__wrap__col-6-27': project.type === 'Mobilier' && cover.ratio > 1,
                    'app-grid__wrap__col-5-27': project.type === 'Mobilier' && cover.ratio <= 1,
                   }"
                   v-for="cover of project.covers" :to="`/projects/${project.slug}`">
<!--          <h2 class="v-index__projects__project__title"-->
<!--          >{{project.title}}</h2>-->
          <img class="v-index__projects__project__cover"
               :src="cover.small"
          />
        </nuxt-link>
      </template>
    </div>
  </main>
</template>


<script setup lang="ts">

import randomArray from "~/composables/randomArray";

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
              tiny: 'file.resize(50, null, 10).url',
              small: 'file.resize(500).url',
              reg: 'file.resize(1280).url',
              large: 'file.resize(1920).url',
              xxl: 'file.resize(2500).url',
            },
          },
        }
      }
    },
  }
})

const randomProjectsOrder: ComputedRef<CMS_API_Response_page[]> = computed(() => {
  if(!data.value) return []
  return randomArray(data.value.result.pages)
})

</script>


<style lang="scss" scoped>
.v-index__projects {
  padding-top: var(--header-height);
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
