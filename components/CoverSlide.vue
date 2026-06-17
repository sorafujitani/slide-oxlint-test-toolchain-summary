<script setup lang="ts">
import GradientHeading from './GradientHeading.vue'
import SocialLinks from './SocialLinks.vue'

interface Props {
  title: string
  subtitle?: string
  event?: string
  author?: string
  social?: {
    github?: string
    twitter?: string
    linkedin?: string
  }
  gradient?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  gradient: true,
})
</script>

<template>
  <div class="cover-slide">
    <div class="cover-content">
      <h1 v-if="!gradient" class="cover-title" v-html="title">
      </h1>
      <GradientHeading v-else tag="h1" class="cover-title" v-html="title">
      </GradientHeading>

      <div v-if="subtitle" class="mt-8 cover-subtitle">
        {{ subtitle }}
      </div>

      <div v-if="event || author" class="mt-16 cover-meta">
        <span v-if="event">{{ event }}</span>
        <span v-if="event && author"> / </span>
        <span v-if="author">{{ author }}</span>
      </div>
    </div>

    <div v-if="social" class="cover-social">
      <SocialLinks
        :github="social.github"
        :twitter="social.twitter"
        :linkedin="social.linkedin"
        size="xl"
      />
    </div>
  </div>
</template>

<style>
/* グローバルスタイル：CoverSlideを含むスライドのレイアウトをリセット */
.slidev-layout:has(.cover-slide) {
  padding: 0 !important;
}
</style>

<style scoped>
.cover-slide {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.cover-content {
  text-align: center;
}

.cover-title {
  margin-bottom: 0;
  font-size: clamp(1.8rem, 4vw, 3rem) !important;
  line-height: 1.1;
}

.cover-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
}

.cover-title {
  font-weight: 900;
  letter-spacing: -0.03em;
}

.cover-meta {
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-text-muted);
}

.cover-social {
  margin-top: 2rem;
}
</style>
