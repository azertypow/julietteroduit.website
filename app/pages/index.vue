<template>
  <main class="v-index"
  >
    <div v-if="data" class="v-index__projects">
      <template v-for="project of randomArray(data.result.pages)">
        <nuxt-link class="v-index__projects__project"
                   v-for="cover of project.covers" :to="`/projects/${project.slug}`">
          <h2 class="v-index__projects__project__title"
          >{{project.title}}</h2>
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

type FetchData = CMS_API_Response & {
  result: {
    pages: {
      "title": string,
      "slug": string,
      "covers": CMS_API_ImageObject_default[]
    }[]
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
          covers: {
            query: "page.covers.toFiles",
            select: {
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

</script>


<style lang="scss" scoped>
.v-index__projects {
  padding-top: var(--header-height);
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  width: 100%;
}

.v-index__projects__project {
  position: relative;
  width: 30rem;
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
