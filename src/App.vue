<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MobileNavSheet from './components/MobileNavSheet.vue'
import { setLenisInstance } from './composables/useLockScroll'

let lenis
let animationFrame
let animationContext
const reviewPanelOpen = ref(false)
const mobileNavOpen = ref(false)
const mobileNavTrigger = ref(null)
const reviewPanel = ref(null)
const reviewBadge = ref(null)
const reviews = [
  { name: 'Lorem Ipsum', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae justo sed erat.' },
  { name: 'Dolor Sit', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel justo vitae.' },
  { name: 'Amet Elit', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.' }
]

const openReviews = async () => {
  gsap.to(reviewBadge.value, { autoAlpha: 0, y: 8, scale: .94, duration: .18, ease: 'power2.in' })
  reviewPanelOpen.value = true
  await nextTick()
  gsap.fromTo(reviewPanel.value, { autoAlpha: 0, y: 20, scale: .92, transformOrigin: 'right bottom' }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, ease: 'power3.out' })
}

const closeReviews = () => {
  gsap.to(reviewPanel.value, { autoAlpha: 0, y: 16, scale: .94, duration: .3, ease: 'power2.inOut', onComplete: async () => {
    reviewPanelOpen.value = false
    await nextTick()
    gsap.fromTo(reviewBadge.value, { autoAlpha: 0, y: 8, scale: .92 }, { autoAlpha: 1, y: 0, scale: 1, duration: .38, ease: 'back.out(1.35)' })
  } })
}

const closeMobileNav = async () => {
  mobileNavOpen.value = false
  await nextTick()
  mobileNavTrigger.value?.focus()
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.1 })
  setLenisInstance(lenis)
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => {
    lenis.raf(time)
    animationFrame = requestAnimationFrame(raf)
  }
  animationFrame = requestAnimationFrame(raf)

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  animationContext = gsap.context(() => {
    if (reduceMotion) return
    gsap.from('.hero-copy > *', { autoAlpha: 0, y: 28, duration: .85, stagger: .1, delay: .18, ease: 'power3.out' })
    gsap.from('.google-review-badge', { autoAlpha: 0, y: 16, scale: .9, duration: .55, delay: .8, ease: 'back.out(1.4)' })
    gsap.utils.toArray('.section').forEach((section) => {
      gsap.from(section.querySelectorAll('.index, h2, .placeholder, article'), { autoAlpha: 0, y: 34, duration: .8, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 82%', once: true } })
    })
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  lenis?.destroy()
  setLenisInstance(null)
  animationContext?.revert()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})

const capabilities = Array.from({ length: 4 }, (_, i) => ({
  title: ['Lorem ipsum', 'Dolor sit amet', 'Consectetur elit', 'Sed do eiusmod'][i],
  copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel justo vitae.'
}))

const categories = Array.from({ length: 3 }, (_, i) => ({
  label: 'Lorem ipsum',
  title: ['Dolor sit amet', 'Consectetur elit', 'Eiusmod tempor'][i],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
  services: ['Lorem ipsum dolor', 'Sit amet consectetur', 'Adipiscing elit sed', 'Eiusmod tempor']
}))

const locations = ['Lorem ipsum', 'Dolor sit', 'Amet elit', 'Consectetur']
const articles = Array.from({ length: 3 }, (_, i) => ({ title: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor'][i] }))
const pad = (value) => String(value).padStart(2, '0')
</script>

<template>
  <div class="page">
    <header class="nav">
      <a class="wordmark" href="#">LOREM</a>
      <nav aria-label="Primary navigation"><a href="#about">Ipsum</a><a href="#services">Dolor</a><a href="#journal">Amet</a></nav>
      <a class="nav-cta" href="#footer">Lorem ipsum <span>&nearr;</span></a>
      <button ref="mobileNavTrigger" class="nav-toggle" type="button" aria-label="Open navigation" aria-controls="mobile-navigation" :aria-expanded="mobileNavOpen" @click="mobileNavOpen = true">
        <span></span><span></span>
      </button>
    </header>

    <MobileNavSheet :open="mobileNavOpen" @close="closeMobileNav" />

    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-shade"></div>
        <div class="hero-placeholder" aria-hidden="true"><span class="image-icon"></span><small>Photo placeholder</small><i>16:9</i></div>
        <div class="hero-copy">
          <p class="eyebrow">Built for better business</p>
          <h1 id="hero-title">Lorem ipsum.<br /><span>Dolor sit amet.</span></h1>
          <p class="hero-support">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div class="hero-actions"><a class="button light" href="#about">Lorem ipsum <span>&nearr;</span></a><a href="#services">Dolor sit amet <span>&rarr;</span></a></div>
        </div>
      </section>

      <section class="credentials" aria-labelledby="credentials-title">
        <div class="credentials-inner">
          <div><p id="credentials-title" class="eyebrow blue">Trusted &amp; verified</p></div>
          <div class="credential-marquee"><div class="credential-track"><ul v-for="set in 2" :key="set" :aria-hidden="set === 2"><li v-for="n in 10" :key="n"><span class="mini-placeholder"></span><b>Logo</b></li></ul></div></div>
        </div>
      </section>

      <section id="about" class="about section">
        <div class="shell">
          <div class="index"><span>02</span> About us</div>
          <p class="section-lead">Lorem ipsum dolor.<br />Sit amet consectetur.</p>
          <div class="about-stage">
            <div class="placeholder photo-placeholder" aria-label="Photo placeholder"><div class="photo-label" aria-hidden="true"><span class="image-icon"></span><small>Photo placeholder</small></div><i class="ratio">4:3</i><div class="proof"><strong>40<small>+</small></strong><p>Lorem ipsum<br />dolor sit amet</p></div></div>
            <div class="about-copy">
              <p class="eyebrow">Who we are</p><h2>Lorem Ipsum</h2>
              <p class="subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae justo sed erat fermentum tincidunt. Integer euismod, arcu a facilisis posuere, erat sem.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae velit vitae arcu efficitur luctus.</p>
              <a class="button blue-button" href="#services">Lorem ipsum <span>&nearr;</span></a>
            </div>
          </div>

          <div class="capabilities">
            <header class="split-heading"><div class="index"><span>03</span> Why choose us</div><div><h2>Lorem ipsum dolor.<br /><span>Consectetur adipiscing.</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p></div></header>
            <ol class="capability-list"><li v-for="(item, i) in capabilities" :key="item.title"><span class="number">{{ pad(i + 1) }}</span><span class="icon-placeholder" role="img" aria-label="Icon placeholder"><i aria-hidden="true"></i><small>Icon</small></span><h3>{{ item.title }}</h3><p>{{ item.copy }}</p></li></ol>
          </div>

          <div class="clients"><div><h3>Trusted by leading teams</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae justo.</p></div><div class="client-marquee"><div class="client-track"><div v-for="set in 2" :key="set" class="client-set" :aria-hidden="set === 2"><span v-for="n in 6" :key="n"><i class="logo-placeholder" aria-hidden="true"></i><b>Logo</b></span></div></div></div></div>
        </div>
      </section>

      <section id="services" class="services section">
        <div class="shell">
          <header class="services-heading split-heading"><div class="index"><span>04</span> Our services</div><div><h2>Lorem ipsum.<br /><span>Dolor sit amet.</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique.</p></div><div class="count"><strong>03</strong><span>Service<br />categories</span></div></header>
          <ol class="category-list"><li v-for="(category, i) in categories" :key="category.title"><article class="category-card"><header><span class="big-number">{{ pad(i + 1) }}</span><p>{{ category.label }}</p><h3>{{ category.title }}</h3><small>{{ category.description }}</small></header><div class="category-placeholder placeholder photo-placeholder" aria-label="Photo placeholder"><div class="photo-label" aria-hidden="true"><span class="image-icon"></span><small>Photo placeholder</small></div><i class="ratio">4:5</i></div><div class="directory"><p>Lorem ipsum dolor</p><ul><li v-for="(service, j) in category.services" :key="service"><a href="#"><small>{{ pad(j + 1) }}</small><strong>{{ service }}</strong><i>&nearr;</i></a></li></ul><a class="directory-cta" href="#">Lorem ipsum dolor <span>&nearr;</span></a></div></article></li></ol>
          <div class="section-footer"><p>Lorem ipsum dolor sit amet?</p><a href="#footer">Lorem ipsum <span>&nearr;</span></a></div>
        </div>
      </section>

      <section class="coverage section">
        <div class="shell">
          <header class="split-heading"><div class="index"><span>05</span> Service areas</div><div><h2>Lorem ipsum.<br /><span>Dolor sit amet.</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</p></div></header>
          <div class="coverage-body"><div class="origin"><span>Lorem ipsum</span><strong>Dolor Sit</strong><p>Amet &amp; consectetur</p></div><ol><li v-for="(location, i) in locations" :key="location"><a href="#"><small>{{ pad(i + 1) }}</small><strong>{{ location }}</strong><span>Lorem ipsum</span><i>&nearr;</i></a></li></ol></div>
          <div class="section-footer dark-footer"><p>Lorem ipsum dolor sit amet.</p><a href="#footer">Lorem ipsum <span>&nearr;</span></a></div>
        </div>
      </section>

      <section class="gallery section">
        <div class="shell"><header class="split-heading"><div class="index"><span>06</span> Gallery</div><div><h2>Lorem ipsum.<br /><span>Dolor sit amet.</span></h2></div></header><div class="bento"><div v-for="(ratio, i) in ['3:4','4:3','4:3','16:9']" :key="ratio + i" class="placeholder photo-placeholder" :class="{ tall: i === 0, wide: i === 3 }" aria-label="Photo placeholder"><div class="photo-label" aria-hidden="true"><span class="image-icon"></span><small>Photo placeholder</small></div><i class="ratio">{{ ratio }}</i></div></div></div>
      </section>

      <section id="journal" class="insights section">
        <div class="shell"><header class="split-heading insights-heading"><div class="index"><span>07</span> Insights</div><div><h2>Lorem ipsum dolor.<br /><span>Sit amet consectetur.</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae justo.</p></div><a href="#">Lorem ipsum <span>&nearr;</span></a></header><div class="articles"><article v-for="(article, i) in articles" :key="article.title"><div class="article-image placeholder photo-placeholder" aria-label="Photo placeholder"><span>{{ pad(i + 1) }}</span><div class="photo-label" aria-hidden="true"><span class="image-icon"></span><small>Photo placeholder</small></div><i class="ratio">{{ i === 0 ? '16:9' : '4:3' }}</i></div><div><p>Lorem ipsum</p><h3>{{ article.title }}</h3><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.</span><a href="#">Lorem ipsum <i>&nearr;</i></a></div></article></div></div>
      </section>
    </main>

    <footer id="footer" class="footer">
      <div class="shell footer-shell"><div class="footer-cta"><div class="index"><span>08</span> Get in touch</div><div><p>Lorem ipsum dolor sit amet?</p><h2>Lorem ipsum dolor<br /><span>sit amet.</span></h2></div><a class="button light" href="#">Lorem ipsum <span>&nearr;</span></a></div><div class="footer-directory"><div><div class="footer-logo">LOREM</div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae justo sed erat.</p><a href="#">lorem@ipsum.com</a><a href="#">+00 000 000 000</a></div><nav v-for="n in 3" :key="n"><h3>Lorem ipsum</h3><a v-for="m in 4" :key="m" href="#">Dolor sit amet <span>&nearr;</span></a></nav></div><div class="footer-bottom"><p>&copy; 2026 Lorem ipsum.</p><a href="#main">Lorem ipsum &uarr;</a></div></div><div class="footer-word">LOREM</div>
    </footer>
    <aside class="google-review-widget" aria-label="Customer reviews">
      <div v-if="reviewPanelOpen" ref="reviewPanel" id="review-panel" class="google-review-panel">
        <header><img class="google-mark" src="/google-g-logo.svg" alt="Google" width="20" height="20" /><strong>5.0</strong><span class="review-stars" aria-label="5 out of 5 stars">★★★★★</span><small>7 reviews</small><button type="button" aria-label="Close reviews" @click="closeReviews">&times;</button></header>
        <ul><li v-for="review in reviews" :key="review.name"><span class="review-avatar">{{ review.name.charAt(0) }}</span><div><strong>{{ review.name }}</strong><span class="review-stars" aria-label="5 out of 5 stars">★★★★★</span><p>{{ review.copy }}</p></div></li></ul>
        <a class="google-review-all" href="#">View all reviews <span>&nearr;</span></a>
      </div>
      <button v-else ref="reviewBadge" class="google-review-badge" type="button" aria-expanded="false" aria-controls="review-panel" @click="openReviews"><img class="google-mark" src="/google-g-logo.svg" alt="Google" width="20" height="20" /><strong>5.0</strong><span class="review-stars" aria-hidden="true">★</span><small>7 reviews</small></button>
    </aside>
  </div>
</template>



