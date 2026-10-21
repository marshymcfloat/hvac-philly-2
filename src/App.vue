<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MobileNavSheet from './components/MobileNavSheet.vue'
import ServicesSection from './components/ServicesSection.vue'
import ServiceAreasSection from './components/ServiceAreasSection.vue'
import ContactSection from './components/ContactSection.vue'
import { setLenisInstance, useLockScroll } from './composables/useLockScroll'

let lenis
let animationFrame
let animationContext
let navbarMedia
const navbar = ref(null)
const navbarLogo = ref(null)
const reviewPanelOpen = ref(false)
const mobileNavOpen = ref(false)
const areaLightboxOpen = ref(false)
const contactSection = ref(null)
const contactFormActive = ref(false)
const mobileNavTrigger = ref(null)
const reviewPanel = ref(null)
const reviewBadge = ref(null)
const setContactFormActive = (active) => {
  contactFormActive.value = active
  if (active) reviewPanelOpen.value = false
}
useLockScroll(reviewPanelOpen)
const reviews = [
  { name: 'James T. · Ardmore', copy: 'Reports that a winter boiler emergency was resolved that evening.' },
  { name: 'Sarah M. · Bryn Mawr', copy: 'Describes competitive AC installation pricing and completion within one day.' },
  { name: 'Michael & Lisa R. · Wayne', copy: 'Describes a furnace repair recommended instead of a replacement.' }
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

  navbarMedia = gsap.matchMedia()
  navbarMedia.add({
    mobile: '(max-width: 650px)',
    desktop: '(min-width: 651px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, ({ conditions }) => {
    const { mobile, reduceMotion } = conditions
    if (reduceMotion) {
      const updateNavbar = () => {
        const scrolled = window.scrollY > 24
        gsap.set(navbar.value, { y: scrolled ? 0 : mobile ? 20 : 32, '--nav-surface': scrolled ? 1 : 0 })
        gsap.set(navbarLogo.value, { scale: scrolled ? 1 : mobile ? 1.05 : 1.15 })
      }
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: updateNavbar, onRefresh: updateNavbar })
      updateNavbar()
      return
    }

    gsap.timeline({
      defaults: { duration: 1, ease: 'none' },
      scrollTrigger: { start: 0, end: mobile ? 96 : 144, scrub: .45 }
    })
      .to(navbar.value, { y: 0, '--nav-surface': 1 }, 0)
      .to(navbarLogo.value, { scale: 1 }, 0)
  }, navbar.value)

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
  navbarMedia?.revert()
  animationContext?.revert()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})

const capabilities = [
  { title: 'Emergency support', icon: 'emergency-support', copy: 'Call 24/7 for urgent heating and cooling failures. Same-day appointments are prioritized for emergencies.' },
  { title: 'Clear pricing', icon: 'clear-pricing', copy: 'No-charge estimates and written quotes before work, with a flat-rate diagnostic call.' },
  { title: 'Older-home expertise', icon: 'older-home-expertise', copy: 'Steam boilers, hydronic heating, and ductless options for Philadelphia rowhouses and Main Line homes.' },
  { title: 'Property care', icon: 'property-care', copy: 'Preventive maintenance and multi-property agreements for landlords, rental buildings, and commercial spaces.' }
]

const articles = [
  {
    label: 'Heating maintenance', title: 'Keep your furnace ready for winter.',
    description: 'Explore gas and oil furnace maintenance, including filters, component care, and seasonal checks.',
    href: 'https://phillyhvacpros.com/2024/07/25/heating-maintenance-for-gas-heaters-and-oil-heaters/',
    image: '/images/insights/furnace-maintenance.webp', thumbnail: '/images/insights/furnace-maintenance-card.webp',
    imageWidth: 1536, imageHeight: 1024,
    alt: 'Technician checking a furnace air filter during seasonal maintenance'
  },
  {
    label: 'Cooling service', title: 'When your AC needs attention.',
    description: 'Learn about cooling diagnostics, refrigerant leaks, airflow problems, and routine upkeep.',
    href: 'https://phillyhvacpros.com/2024/07/25/ac-repair-in-philadelphia/',
    image: '/images/insights/ac-diagnostics.webp', thumbnail: '/images/insights/ac-diagnostics-card.webp',
    imageWidth: 1122, imageHeight: 1402,
    alt: 'Technician using a diagnostic meter beside an outdoor air conditioner'
  },
  {
    label: 'Main Line properties', title: 'HVAC care for homes & businesses.',
    description: 'Heating, cooling, and maintenance options for Main Line homeowners, landlords, and property managers.',
    href: 'https://phillyhvacpros.com/2025/06/21/reliable-hvac-services-for-main-line-pa-heating-cooling-for-homes-businesses/',
    image: '/images/insights/main-line-property-care.webp', thumbnail: '/images/insights/main-line-property-care-card.webp',
    imageWidth: 1122, imageHeight: 1402,
    alt: 'Well-maintained heat pump beside a stone and brick Main Line home'
  }
]
const footerGroups = [
  { title: 'Services', links: [{ label: 'Heating & boilers', href: '#service-heating' }, { label: 'Air conditioning', href: '#service-cooling' }, { label: 'Heat pumps & ductless', href: '#service-cooling' }, { label: 'Water heaters & plumbing', href: '#service-water-heaters' }, { label: 'Indoor air & controls', href: '#service-air-quality' }, { label: 'Commercial & property care', href: '#service-commercial' }] },
  { title: 'Explore', links: [{ label: 'About us', href: '#about' }, { label: 'Service areas', href: '#coverage' }, { label: 'Home comfort insights', href: '#journal' }] },
  { title: 'Contact', links: [{ label: 'Call 215-416-6557', href: 'tel:2154166557' }, { label: 'Request an estimate', href: '#contact' }, { label: '24/7 emergency service', href: 'tel:2154166557' }, { label: 'Home warranty customers welcome', href: 'mailto:1superiorcomfortllc@gmail.com' }] }
]
const pad = (value) => String(value).padStart(2, '0')
</script>

<template>
  <div class="page" :inert="areaLightboxOpen">
    <header ref="navbar" class="nav">
      <a ref="navbarLogo" class="wordmark brand-logo" href="#main" aria-label="Philly HVAC Pros home"><img src="/philly-hvac-pros-logo.png" alt="Superior Comfort Heating &amp; Cooling" width="1000" height="1000" fetchpriority="high" /></a>
      <nav aria-label="Primary navigation"><a href="#about">About</a><a href="#services">Services</a><a href="#journal">Insights</a></nav>
      <a class="nav-cta" href="tel:2154166557">215-416-6557 <span>&nearr;</span></a>
      <button ref="mobileNavTrigger" class="nav-toggle" type="button" aria-label="Open navigation" aria-controls="mobile-navigation" :aria-expanded="mobileNavOpen" @click="mobileNavOpen = true">
        <span></span><span></span>
      </button>
    </header>

    <MobileNavSheet :open="mobileNavOpen" @close="closeMobileNav" />

    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-shade"></div>
        <img class="hero-image" src="/images/philly-hvac-hero.webp" alt="HVAC technician inspecting a heat pump beside a Philadelphia brick home at dusk" width="1672" height="941" fetchpriority="high" decoding="async" />
        <div class="hero-copy">
          <p class="eyebrow">Philadelphia &amp; Main Line HVAC</p>
          <h1 id="hero-title">Your comfort.<br /><span>Our priority.</span></h1>
          <p class="hero-support">Heating, cooling, and water-heater service for homes and businesses across Philadelphia and the surrounding counties. Call 24/7 for emergency repairs.</p>
          <div class="hero-actions"><a class="button light" href="tel:2154166557">Call 215-416-6557 <span>&nearr;</span></a><a href="#services">Explore our services <span>&rarr;</span></a></div>
        </div>
      </section>

      <section class="trust-band" aria-labelledby="trust-title">
        <div class="shell trust-inner">
          <h2 id="trust-title">Local care. Year-round comfort.</h2>
          <ul class="trust-items">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6Z" /><path d="m8 12 3 3 5-6" /></svg>
              <span>Licensed &amp; insured</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-2-4" /></svg>
              <span>Homes &amp; businesses</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6" /><path d="m9 9 2 2 4-4M8 14l-1 7 5-3 5 3-1-7" /></svg>
              <span>All major brands</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11a8 8 0 0 1-8 8H7l-4 3V11a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" /><path d="M7 8h10M7 12h7" /></svg>
              <span>Written quotes</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="about" class="about section">
        <div class="shell">
          <div class="index"><span>02</span> About us</div>
          <p class="section-lead">Philadelphia homes.<br />Local HVAC know-how.</p>
          <div class="about-stage">
            <div class="about-photo placeholder"><img src="/images/philly-hvac-about.webp" alt="HVAC technician explaining thermostat controls to a homeowner in a Philadelphia rowhouse" width="1448" height="1086" loading="lazy" decoding="async" /><div class="proof"><strong>24/7</strong><p>Emergency<br />HVAC service</p></div></div>
            <div class="about-copy">
              <p class="eyebrow">Superior Comfort Heating &amp; Cooling LLC</p><h2>Philly HVAC Pros</h2>
              <p class="subtitle">Heating and cooling care for the places you live and work.</p>
              <p>From Philadelphia rowhouses to Main Line homes and commercial properties, we repair, install, and maintain the systems that keep your space comfortable.</p>
              <p>Our services cover furnaces, steam and hot-water boilers, central air, heat pumps, ductless systems, and water heaters. Homeowners, landlords, property managers, and home warranty customers are welcome.</p>
              <a class="button blue-button" href="#services">Find your service <span>&nearr;</span></a>
            </div>
          </div>

          <div class="capabilities">
            <header class="split-heading"><div class="index"><span>03</span> Why choose us</div><div><h2>Local expertise.<br /><span>Practical solutions.</span></h2><p>From urgent repairs to planned upgrades, get service built around your property and your comfort needs.</p></div></header>
            <ol class="capability-list"><li v-for="(item, i) in capabilities" :key="item.title"><span class="number">{{ pad(i + 1) }}</span><span class="capability-icon" aria-hidden="true"><img :src="'/icons/' + item.icon + '.svg'" alt="" width="48" height="48" loading="lazy" /></span><h3>{{ item.title }}</h3><p>{{ item.copy }}</p></li></ol>
          </div>
        </div>
      </section>

      <ServicesSection @request-service="contactSection?.selectService($event)" />

      <ServiceAreasSection @lightbox-change="areaLightboxOpen = $event" />

      <section id="journal" class="insights section">
        <div class="shell">
          <header class="split-heading insights-heading"><div class="index"><span>06</span> Home comfort insights</div><div><h2>Know your system.<br /><span>Plan your next step.</span></h2><p>Explore our articles on heating maintenance, cooling repairs, and HVAC care for local properties.</p></div><a href="tel:2154166557">Ask our team <span>&nearr;</span></a></header>
          <div class="articles">
            <article v-for="(article, i) in articles" :key="article.title">
              <a class="article-image" :href="article.href" :aria-label="'Read article: ' + article.title">
                <img :src="article.thumbnail" :srcset="article.thumbnail + ' 768w, ' + article.image + ' ' + article.imageWidth + 'w'" :sizes="i === 0 ? '(min-width: 901px) 55vw, (min-width: 651px) 90vw, 82vw' : '(min-width: 901px) 220px, (min-width: 651px) 45vw, 82vw'" :alt="article.alt" :width="article.imageWidth" :height="article.imageHeight" loading="lazy" decoding="async" />
                <span aria-hidden="true">{{ pad(i + 1) }}</span>
              </a>
              <div><p>{{ article.label }}</p><h3>{{ article.title }}</h3><span>{{ article.description }}</span><a :href="article.href">Read article <i>&nearr;</i></a></div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer id="footer" class="footer">
      <div class="shell footer-shell">
        <ContactSection ref="contactSection" @form-active="setContactFormActive" />
        <div class="footer-directory"><div><a class="footer-logo brand-logo" href="#main" aria-label="Philly HVAC Pros home"><img src="/philly-hvac-pros-logo.png" alt="Superior Comfort Heating &amp; Cooling" width="1000" height="1000" loading="lazy" /></a><p>Superior Comfort Heating &amp; Cooling LLC.<br />545 N 58th Street<br />Philadelphia, PA 19131, USA</p><a href="mailto:1superiorcomfortllc@gmail.com">1superiorcomfortllc@gmail.com</a><a href="tel:2154166557">215-416-6557</a></div><nav v-for="group in footerGroups" :key="group.title" :aria-label="group.title"><h3>{{ group.title }}</h3><a v-for="link in group.links" :key="link.label" :href="link.href">{{ link.label }} <span>&nearr;</span></a></nav></div>
        <div class="footer-bottom"><p>&copy; 2026 Superior Comfort Heating &amp; Cooling LLC.</p><a href="#main">Back to top &uarr;</a></div>
      </div><div class="footer-word" aria-hidden="true">PHILLY HVAC</div>
    </footer>
    <Teleport to="body">
      <aside v-show="!mobileNavOpen && !areaLightboxOpen && !contactFormActive" class="google-review-widget" aria-label="Customer testimonials" data-lenis-prevent>
        <div v-if="reviewPanelOpen" ref="reviewPanel" id="review-panel" class="google-review-panel" data-lenis-prevent @keydown.esc="closeReviews">
          <header><strong>Customer stories</strong><button type="button" aria-label="Close testimonials" @click="closeReviews">&times;</button></header>
          <ul data-lenis-prevent><li v-for="review in reviews" :key="review.name"><span class="review-avatar">{{ review.name.charAt(0) }}</span><div><strong>{{ review.name }}</strong><span class="review-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><p>{{ review.copy }}</p></div></li></ul>
          <p class="review-source-note">Summaries of testimonials published on our website.</p>
          <a class="google-review-all" href="https://phillyhvacpros.com/hvac-services-center-city-philadelphia-pa/">View source testimonials <span>&nearr;</span></a>
        </div>
        <button v-else ref="reviewBadge" class="google-review-badge" type="button" aria-expanded="false" aria-controls="review-panel" @click="openReviews"><span class="review-stars" aria-hidden="true">&#9733;</span><strong>Customer stories</strong><small>3 testimonials</small></button>
      </aside>
    </Teleport>
  </div>
</template>
