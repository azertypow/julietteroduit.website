<template>
  <main class="v-projects-slug"
  >
    <template v-if="data">
      <section class="v-projects-slug__gallery">
        <div class="v-projects-slug__gallery__container">
          <div class="v-projects-slug__gallery__container__item"
               v-for="image of data.result.page.gallery">
            <img class="v-projects-slug__gallery__container__item__img"
                 :src="image.large"
            />
          </div>
        </div>
      </section>

      <section class="v-projects-slug__info-container">
        <header class="v-projects-slug__info-container__header">
          <h1>{{data.result.page.title}}</h1>
        </header>

        <main class="v-projects-slug__info-container__main">
          <div class="v-projects-slug__info-container__main__infos">
            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Client:</div>
              <div v-html="data.result.page.client"/>
            </div>

            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Localisation:</div>
              <div v-html="data.result.page.localisation"/>
            </div>

            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Date:</div>
              <div>{{new Date(data.result.page.date).getFullYear()}}</div>
            </div>

            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Crédit:</div>
              <div v-html="data.result.page.photo_credits"/>
            </div>
          </div>

          <div class="v-projects-slug__info-container__main__content"
               v-html="data.result.page.content"
          />
        </main>
      </section>
    </template>
  </main>
</template>


<script setup lang="ts">

const slug = useRoute().params.slug

type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string
      slug: string
      gallery: CMS_API_ImageObject_default[]
      content: string
      client: string
      localisation: string
      date: string
      photo_credits: string
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
        query: `site.find('/projets/${slug}')`,
        select: {
          title: true,
          slug: true,
          client: true,
          localisation: true,
          date: true,
          photo_credits: true,
          content: {
            query: "page.content.content",
          },
          gallery: {
            query: "page.gallery.toFiles",
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
.v-projects-slug__gallery {
  width: 100%;
  overflow: auto;
}

.v-projects-slug__gallery__container {
  display: flex;
  flex-wrap: nowrap;
  gap: 3rem;
}

.v-projects-slug__gallery__container__item {
  display: block;
}

.v-projects-slug__gallery__container__item__img {
  height: 100vh;
  width: auto;
  //max-width: 50vw;
  object-fit: contain;
  object-position: top;
}

.v-projects-slug__info-container {
  margin-top: -5rem;
  padding-left: 3rem;
  padding-right: 3rem;
  font-size: 2rem;
  line-height: 1.25em;
}

.v-projects-slug__info-container__header {
  h1 {
    margin: 0;
    font-size: 3rem;
    font-weight: 400;
  }

  padding-bottom: 5rem;
}

.v-projects-slug__info-container__main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.v-projects-slug__info-container__main__infos__item {
  display: flex;
  flex-wrap: nowrap;
  gap: .5em;

  > * {
    &:first-child {
      flex-shrink: 0;
    }
  }
}

.v-projects-slug__info-container__main__content {
  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}
</style>
