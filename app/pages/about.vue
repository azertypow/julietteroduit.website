<template>
  <main class="v-about">
    <template v-if="data">
      <section class="v-about__content">
        <main class="v-about__content__main">
          <div class="v-about__content__main__text"
               v-html="data.result.page.content"
          />
        </main>
      </section>
    </template>
  </main>
</template>


<script setup lang="ts">

type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string
      slug: string
      content: string
    }
  }
}

const {data, status} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      page: {
        query: `site.find('/a-propos')`,
        select: {
          title: true,
          slug: true,
          content: {
            query: "page.content.content",
          },
        }
      }
    },
  }
})

</script>


<style lang="scss" scoped>
.v-about__content {
  padding-left: 3rem;
  padding-right: 3rem;
  font-size: 2rem;
  line-height: 1.25em;
}

.v-about__content__header {
  h1 {
    margin: 0;
    font-size: 3rem;
    font-weight: 400;
  }

  padding-bottom: 5rem;
}

.v-about__content__main__text {
  max-width: 60rem;

  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}
</style>
