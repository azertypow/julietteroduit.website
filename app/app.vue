<template>
  <div class="v-app"
  >
    <header class="v-app__header"
    >
      <NuxtLink to="/"
      >{{data?.result.site.title}}</NuxtLink>
      <NuxtLink to="/about"
                v-if="useRoute().matched[0]?.path !== '/about'"
      >À propos</NuxtLink>
    </header>
    <div>
      <NuxtPage />
    </div>
    <transition name="next-project">
      <div class="v-app__project-nav app-font-small"
           v-if="useNextProjectSlug().value && useProjectInfoIsOpen().value"
      >
          <nuxt-link
                     :to="`/projects/${useNextProjectSlug().value}`"
                     class="v-app__project-nav__link"
          >projet suivant</nuxt-link>
      </div>
    </transition>
  </div>
</template>


<script setup lang="ts">
import {
  useBeforeTopPosition_about,
  useBeforeTopPosition_homePage,
  useNextProjectSlug,
  useProjectInfoIsOpen
} from "~/composables/store";

type FetchData = CMS_API_Response & {
  result: {
    site: {
      "title": string,
    }
  }
}

useRouter().beforeEach((to, from, next) => {

  if(from.path === '/') {
    useBeforeTopPosition_homePage().value = window.scrollY
  }
  if(from.path === '/about') {
    useBeforeTopPosition_about().value = window.scrollY
  }

  next()
})

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

.v-app__project-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: flex-end;
  padding: calc( var(--app-gap) / 2 );
  background: white;
}

.v-app__project-nav__link {
  text-decoration: none;
}

.next-project-enter-active {
  transition: opacity 1s .5s ease-in-out, transform 1s .5s ease-in-out;
}

.next-project-enter-from {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}
</style>
