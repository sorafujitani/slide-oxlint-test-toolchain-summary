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

.slidev-page:has(.cover-slide) {
  border-radius: 0 !important;
  background:
    radial-gradient(ellipse 132% 72% at 50% -14%,
      rgb(118 220 232 / 0.9) 0%,
      rgb(178 234 241 / 0.68) 48%,
      transparent 78%
    ),
    linear-gradient(180deg,
      rgb(224 246 250) 0%,
      var(--color-bg) 58%,
      var(--color-bg) 100%
    ) !important;
}
</style>

<style scoped>
.cover-slide {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(ellipse 132% 72% at 50% -14%,
      rgb(118 220 232 / 0.9) 0%,
      rgb(178 234 241 / 0.68) 48%,
      transparent 78%
    ),
    linear-gradient(180deg,
      rgb(224 246 250) 0%,
      var(--color-bg) 58%,
      var(--color-bg) 100%
    );
}

.cover-content {
  width: 100%;
  max-width: 960px;
  text-align: center;
  transform: translateX(-1.25rem);
}

.cover-title {
  width: 100%;
  margin-bottom: 0;
  font-size: clamp(1.4rem, 2.7vw, 2rem) !important;
  line-height: 1.1;
  text-align: center;
}

.cover-title.gradient-heading {
  background: linear-gradient(135deg,
    oklch(0.42 0.22 255) 0%,
    oklch(0.60 0.22 228) 46%,
    oklch(0.76 0.18 205) 100%
  );
  background-size: 180% 180%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cover-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
}

.cover-title {
  font-weight: 800;
  letter-spacing: -0.02em;
}

.cover-meta {
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-text-muted);
  width: 100%;
}

.cover-social {
  margin-top: 2rem;
}
</style>
