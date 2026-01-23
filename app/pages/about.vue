<template>
  <main class="v-about">
    <template v-if="data">
      <div class="v-about__content">
        <main class="v-about__content__main">
          <div class="v-about__content__main__text"
               v-html="data.result.page.content"
          />
          <HtmlContentWithObfuscatedEmail
            :text-html-content="data.result.page.content"
          />
        </main>
        <section class="v-about__projects-list">
          <h2 class="v-about__projects-list__title">Liste des projets</h2>
          <div class="v-about__projects-list__content">
            <div class="v-about__projects-list__content__body">
              <template v-for="project of data.result.projects">
                <ProjectListItem
                  :title="project.title"
                  :client="project.client"
                  :date="project.date"
                />
              </template>
            </div>
          </div>
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
    },
    projects: {
      title: string,
      slug: string,
      date: string,
      client: string,
      covers: CMS_API_ImageObject_default[]
    }[]
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
      },
      projects: {
        query: "site.find('/projets').children",
        select: {
          title: true,
          slug: true,
          client: true,
          date: true,
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
      },
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

.v-about__projects-list {
  max-width: 120rem;
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
</style>
