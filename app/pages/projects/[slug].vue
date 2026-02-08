<template>
  <main class="v-projects-slug"
        :class="{
          'is-open': infoIsOpen,
        }"
  >
      <section class="v-projects-slug__gallery" ref="galleryRef">
        <div v-if="data" class="v-projects-slug__gallery__container">
          <div class="v-projects-slug__gallery__container__item"
               v-for="image of data.result.page.gallery">
            <img class="v-projects-slug__gallery__container__item__img"
                 :src="image.large.url"
                 :alt="image.alt"
            />
          </div>
        </div>
      </section>


      <template v-if="data">

        <header class="v-projects-slug__info-header-toggle"
                v-if="!infoIsOpen"
                @click="infoIsOpen = true"
                aria-label="Ouvrir les infos"
        >
          <h1>{{data.result.page.title}}</h1>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z"/></svg>
        </header>

        <Transition name="info-fade">
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
        </Transition>

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

const {data, status, pending} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
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


onMounted(() => {
  scrollEventListener()
})

function scrollEventListener() {
  if (galleryRef.value) {
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
  height: calc( 100vh - 6rem - var(--header-height) );
  width: auto;
  //max-width: 50vw;
  object-fit: contain;
  object-position: top;
  transition: height 1s ease-in-out;

  .is-open & {
    height: calc( 50vh - var(--header-height) );
  }
}

.v-projects-slug__info-header-toggle {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 1rem 3rem;
  box-sizing: border-box;
  height: 6rem;
  cursor: pointer;

  > * {
    margin: 0;
    font-size: 3rem;
    font-weight: 400;
    display: block;
    fill: currentColor;
  }

  > svg {
    height: 2.75rem;
    width: auto;
  }

}

.info-fade-enter-active {
  transition: opacity 1s .25s ease-in-out, transform 1s ease-in-out;
}

.info-fade-enter-from {
  opacity: 0;
  transform: translate3d(0, calc( 100% - 6rem), 0);
}

.info-fade-leave-active {
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
}

.info-fade-leave-to {
  opacity: 0;
  transform: translate3d(0, calc( 100% - 6rem), 0);
}

.v-projects-slug__info-container {
  padding: 2rem 3rem;
  font-size: 2rem;
  line-height: 1.25em;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  background: white;
  box-sizing: border-box;
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

  .info-fade-leave-active & {
    h1 {
      transition: opacity .25s ease-in-out;
      opacity: 0;
    }
  }

  svg {
    display: block;
    width: auto;
    height: 3rem;
    animation: info-svg-rotate 1s .75s ease forwards;
  }

}

@keyframes info-svg-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}

.v-projects-slug__info-container__main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  animation: info-main-appear .5s .75s ease-in-out both;

  .info-fade-leave-active & {
    animation: none;
    transition: opacity .25s ease-in-out;
  }

  .info-fade-leave-to & {
    opacity: 0;
  }
}

@keyframes info-main-appear {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
