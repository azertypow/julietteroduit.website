<template>
  <div class="v-app"
  >
    <header class="v-app__header"
    >
      <NuxtLink to="/"
      >{{data?.result.site.title}}</NuxtLink>
      <NuxtLink to="/about"
      >À propos</NuxtLink>
    </header>
    <div>
      <NuxtPage />
    </div>
  </div>
</template>


<script setup lang="ts">

type FetchData = CMS_API_Response & {
  result: {
    site: {
      "title": string,
    }
  }
}


const {data, status} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      site: {
        query: "site",
        select: {
          title: true,
        }
      }
    },
  }
})


</script>


<style lang="scss" scoped>
.v-app {
  padding-top: var(--header-height);
}

.v-app__header {
  height: var(--header-height);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  z-index: 100;
  padding: 1rem 3rem;
  background: white;

  > * {
    color: inherit;
    text-decoration: none;
    display: block;
  }
}
</style>
