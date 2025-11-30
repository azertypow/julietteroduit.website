<template>
  <main class="v-projects-slug"
        :class="{
          'is-open': infoIsOpen,
        }"
  >
    <template v-if="data">
      <section class="v-projects-slug__gallery" ref="galleryRef">
        <div class="v-projects-slug__gallery__container">
          <div class="v-projects-slug__gallery__container__item"
               v-for="image of data.result.page.gallery">
            <img class="v-projects-slug__gallery__container__item__img"
                 :src="image.large"
            />
          </div>
        </div>
      </section>


      <header class="v-projects-slug__info-header-toggle"
              v-if="!infoIsOpen"
              @click="infoIsOpen = true"
              aria-label="Ouvrir les infos"
      >
        <h1>{{data.result.page.title}}</h1>
      </header>


      <section class="v-projects-slug__info-container"
               v-if="infoIsOpen"
      >
        <header class="v-projects-slug__info-container__header"
                @click="infoIsOpen = false"
        >
          <h1>{{data.result.page.title}}</h1>

          <button aria-label="Fermer les Infos"
                  @click="infoIsOpen = false"
          >
            <svg aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </button>
        </header>

        <main class="v-projects-slug__info-container__main">
          <div class="v-projects-slug__info-container__main__infos">
            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Client·exs&nbsp;:</div>
              <div v-html="data.result.page.client"/>
            </div>

            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Lieu&nbsp;:</div>
              <div v-html="data.result.page.localisation"/>
            </div>

            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Année&nbsp;:</div>
              <div>{{new Date(data.result.page.date).getFullYear()}}</div>
            </div>

            <div class="v-projects-slug__info-container__main__infos__item" >
              <div>Photos&nbsp;:</div>
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
const galleryRef = ref<HTMLElement | null>(null)
const infoIsOpen = ref(false)

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
}).then( res => {

  nextTick().then( () => {
    window.setTimeout( scrollEventListener, 500 )
  } )

  return {
    data: res.data,
    status: res.status,
  }
})


async function scrollEventListener() {

  console.log(galleryRef.value)

  if (galleryRef.value) {
    console.log('add scroll')
    galleryRef.value.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault()
      if (galleryRef.value) {
        galleryRef.value.scrollLeft += e.deltaY
      }
    }, { passive: false })
  }
}

</script>


<style lang="scss" scoped>
.v-projects-slug__gallery {
  width: 100%;
  overflow: auto;
  //overscroll-behavior: contain;
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
  height: calc( 100vh - 6rem );
  width: auto;
  //max-width: 50vw;
  object-fit: contain;
  object-position: top;

  .is-open & {
    height: 50vh;
  }
}

.v-projects-slug__info-header-toggle {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  box-sizing: border-box;
  height: 6rem;
  cursor: pointer;

  > * {
    margin: 0;
    font-size: 3rem;
    font-weight: 400;
  }

}

.v-projects-slug__info-container {
  padding: 2rem 3rem;
  font-size: 2rem;
  line-height: 1.25em;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: white;
}

.v-projects-slug__info-container__header {
  padding-bottom: 5rem;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  > * {
    margin: 0;
    font-size: 3rem;
    font-weight: 400;
  }

  svg {
    display: block;
    width: auto;
    height: 3rem;
  }

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
