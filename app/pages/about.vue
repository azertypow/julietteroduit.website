<template>
  <main class="v-about">
    <template v-if="data">
      <div class="v-about__content">
        <main class="v-about__content__main">
          <HtmlContentWithObfuscatedEmail
            class="v-about__content__main__text"
            :text-html-content="data.result.page.content"
          />
        </main>
        <section class="v-about__projects-list">
          <h2 class="v-about__projects-list__title">Projets</h2>
          <div class="v-about__projects-list__content">
            <div class="v-about__projects-list__content__body">
              <template v-for="project of data.result.projects.sort((a, b) => b.date.localeCompare(a.date))">
                <ProjectListItem
                  :title="project.title"
                  :client="project.client"
                  :date="project.date"
                  :slug="project.slug"
                  :cover="project.miniature?.[0]?.small"
                />
              </template>
            </div>
          </div>
        </section>
        <section class="v-about__credits">
          <div v-html="data.result.page.credits"
               class="v-about__credits__text"
          />
        </section>
      </div>
    </template>
  </main>
</template>


<script setup lang="ts">

import ProjectListItem from "~/components/ProjectListItem.vue";
import HtmlContentWithObfuscatedEmail from "~/components/HtmlContentWithObfuscatedEmail.vue";

type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string
      slug: string
      content: string
      credits: string
    },
    projects: {
      title: string,
      slug: string,
      date: string,
      client: string,
      miniature?: CMS_API_ImageObject_default[]
    }[]
  }
}

const {data, status, pending} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
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
          credits: true,
        }
      },
      projects: {
        query: "site.find('/projets').children",
        select: {
          title: true,
          slug: true,
          client: true,
          date: true,
          miniature: {
            query: "page.miniature.toFiles",
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
      },
    },
  }
})

watch(pending, async (value) => {

  if( !value ) {
    const savedPosition = window.history.state?.scroll

    await nextTick()
    window.scrollTo({
      top: savedPosition?.top ?? 0,
      behavior: 'smooth'
    })
  }
})

</script>


<style lang="scss" scoped>
.v-about__content {
  font-size: 2rem;
  line-height: 1.25em;
  padding-bottom: 50vh;
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

.v-about__projects-list {
  max-width: 120rem;
  padding-bottom: 2rem;

}

:global(.v-about__projects-list__content:hover .v-about__projects-list__content__body > * ) {
  opacity: .25;
}

:global(.v-about__projects-list__content > .v-about__projects-list__content__body > *:hover ) {
  opacity: 1;
}

.v-about__projects-list__content__header {
  display: flex;
  width: 100%;
  gap: var(--app-gap);
  padding-bottom: 1rem;
}

.v-about__projects-list__content__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.v-about__projects-list__content__header__title {
  width: calc(100% / 12 * 6);
  margin: 0;
}
.v-about__projects-list__content__header__client {
  width: calc(100% / 12 * 4);
  margin: 0;
}
.v-about__projects-list__content__header__year {
  width: calc(100% / 12 * 2);
  margin: 0;
}

.v-about__credits {
  position: sticky;
  bottom: 0;
  box-sizing: border-box;
  background: white;
}

:global(.v-about__credits__text > *) {
  font-size: 1.35rem;
  line-height: 1.25em;
  padding-top: .25rem;
  padding-bottom: .25rem;
  color: rgba(0, 0, 0, .5);
}
</style>
