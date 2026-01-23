<template>
  <div
    class="v-html-content-with-obfuscated-email"
    ref="containerRef"
    v-html="processedContent"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps<{
  textHtmlContent: string
}>()

const containerRef = ref<HTMLElement | null>(null)

const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
const mailtoRegex = /href=["']mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})["']/g

function encodeEmail(email: string): string {
  return btoa(email)
}

function obfuscateEmailInText(text: string): string {
  return text.replace(emailRegex, (match) => {
    const encoded = encodeEmail(match)
    return `<span class="obfuscated-email" data-encoded="${encoded}">[email protégé, cliquez pour afficher]</span>`
  })
}

function obfuscateMailtoLinks(html: string): string {
  return html.replace(mailtoRegex, (match, email) => {
    const encoded = encodeEmail(email)
    return `href="#" data-mailto-encoded="${encoded}"`
  })
}

const processedContent = computed(() => {
  let content = props.textHtmlContent
  content = obfuscateMailtoLinks(content)
  content = obfuscateEmailInText(content)
  return content
})

function decodeAndReplaceEmails() {
  if (!containerRef.value) return

  const obfuscatedSpans = containerRef.value.querySelectorAll('.obfuscated-email')
  obfuscatedSpans.forEach((span) => {
    const encoded = span.getAttribute('data-encoded')
    if (encoded) {
      try {
        span.textContent = atob(encoded)
      } catch (e) {
        // Keep placeholder if decoding fails
      }
    }
  })

  const mailtoLinks = containerRef.value.querySelectorAll('[data-mailto-encoded]')
  mailtoLinks.forEach((link) => {
    const encoded = link.getAttribute('data-mailto-encoded')
    if (encoded) {
      try {
        const decoded = atob(encoded)
        link.setAttribute('href', `mailto:${decoded}`)
        link.removeAttribute('data-mailto-encoded')
      } catch (e) {
        // Keep # href if decoding fails
      }
    }
  })
}

onMounted(() => {
  nextTick(() => {
    window.setTimeout(() => decodeAndReplaceEmails(), 1_000)
  })
})

watch(() => props.textHtmlContent, () => {
  nextTick(() => {
    window.setTimeout(() => decodeAndReplaceEmails(), 1_000)
  })
})
</script>

<style lang="scss" scoped>
.v-html-content-with-obfuscated-email {
  :deep(.obfuscated-email) {
    // Style identique au texte environnant
  }
}
</style>
