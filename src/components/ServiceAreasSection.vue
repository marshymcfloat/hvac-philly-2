<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLockScroll } from '../composables/useLockScroll'
import { serviceAreas } from '../data/serviceAreas'

const emit = defineEmits(['lightbox-change'])
const activeIndex = ref(null)
const activeArea = computed(() => activeIndex.value === null ? null : serviceAreas[activeIndex.value])
const lightboxOpen = computed(() => activeIndex.value !== null)
const dialog = ref(null)
const closeButton = ref(null)
let opener

useLockScroll(lightboxOpen)
watch(lightboxOpen, (open) => emit('lightbox-change', open))

const openArea = async (index, event) => {
  opener = event.currentTarget
  activeIndex.value = index
  await nextTick()
  closeButton.value?.focus()
}

const close = async () => {
  activeIndex.value = null
  await nextTick()
  if (opener?.isConnected) opener.focus({ preventScroll: true })
}

const move = (direction) => {
  if (!lightboxOpen.value) return
  activeIndex.value = (activeIndex.value + direction + serviceAreas.length) % serviceAreas.length
}

const onKeydown = (event) => {
  if (!lightboxOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    move(event.key === 'ArrowRight' ? 1 : -1)
  } else if (event.key === 'Tab') {
    const buttons = dialog.value?.querySelectorAll('button')
    if (!buttons?.length) return
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  emit('lightbox-change', false)
})
</script>

<template>
  <section id="coverage" class="service-areas section" aria-labelledby="areas-title">
    <div class="shell">
      <header class="area-heading">
        <div class="index"><span>05</span> Where we work</div>
        <h2 id="areas-title">Rooted in Philly.<br /><span>Close to home.</span></h2>
        <p>Serving Philadelphia, the Main Line, and communities across Delaware, Montgomery, Bucks, and Chester counties.</p>
      </header>

      <ul class="area-grid" aria-label="Service areas and local landmarks">
        <li v-for="(area, index) in serviceAreas" :key="area.id">
          <article class="area-card" :aria-labelledby="'area-' + area.id">
            <button class="area-image" type="button" :aria-label="'View ' + area.landmark + ' landmark image for ' + area.name" aria-haspopup="dialog" @click="openArea(index, $event)">
              <img :src="area.thumbnail" :srcset="area.thumbnail + ' 768w, ' + area.image + ' 1536w'" :sizes="index < 2 ? '(min-width: 1050px) 58vw, (min-width: 700px) 50vw, 100vw' : '(min-width: 700px) 34vw, 50vw'" :alt="area.alt" width="1536" height="1024" loading="lazy" decoding="async" />
              <span v-if="index === 0" class="area-home">Our home base</span>
              <span class="area-zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg></span>
            </button>
            <div class="area-copy">
              <h3 :id="'area-' + area.id">{{ area.name }}</h3>
              <p class="area-landmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>{{ area.landmark }}</p>
              <p class="area-communities">{{ area.communities }}</p>
            </div>
          </article>
        </li>
      </ul>

      <div class="area-contact">
        <div><h3>Is your neighborhood covered?</h3><p>Call with your address to check local service availability.</p></div>
        <a href="tel:2154166557">Call 215-416-6557 <span aria-hidden="true">&nearr;</span></a>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="activeArea" ref="dialog" class="area-lightbox" role="dialog" aria-modal="true" aria-labelledby="area-lightbox-title" aria-describedby="area-lightbox-region" data-lenis-prevent @click.self="close">
        <header class="area-lightbox-header">
          <div><p id="area-lightbox-region">{{ activeArea.name }}</p><h2 id="area-lightbox-title">{{ activeArea.landmark }}</h2><p class="area-lightbox-communities">{{ activeArea.communities }}</p></div>
          <button ref="closeButton" type="button" aria-label="Close landmark image" @click="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg></button>
        </header>
        <div class="area-lightbox-image" @click.self="close"><img :key="activeArea.id" :src="activeArea.image" :alt="activeArea.alt" width="1536" height="1024" /></div>
        <footer class="area-lightbox-footer">
          <button type="button" aria-label="Previous landmark" @click="move(-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m14 5-7 7 7 7" /></svg></button>
          <p role="status" aria-live="polite">{{ activeIndex + 1 }} / {{ serviceAreas.length }}</p>
          <button type="button" aria-label="Next landmark" @click="move(1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m10 5 7 7-7 7" /></svg></button>
        </footer>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.service-areas{color:var(--navy);background:#eef4f6;font-weight:500}
.area-heading{display:grid;gap:24px;margin-bottom:32px}
.area-heading h2{margin:0;font:800 clamp(2.4rem,6vw,5rem)/.98 'Manrope',sans-serif;letter-spacing:-.055em}
.area-heading h2>span{color:var(--blue)}
.area-heading>p{max-width:490px;margin:0;color:#52616c;font-size:16px;font-weight:500;line-height:1.7}
.area-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:clamp(320px,90vw,420px) 230px repeat(2,220px);gap:12px;margin:0;padding:0;list-style:none}
.area-grid>li{min-width:0;min-height:0}
.area-grid>li:nth-child(-n+2){grid-column:1/-1}
.area-card{position:relative;isolation:isolate;height:100%;overflow:hidden;background:var(--navy);border-radius:10px}
.area-card:after{position:absolute;z-index:1;inset:0;content:'';pointer-events:none;background:linear-gradient(180deg,rgba(6,25,45,.08) 12%,rgba(6,25,45,.12) 35%,rgba(6,25,45,.82) 72%,rgba(6,25,45,.98))}
.area-image{position:absolute;inset:0;display:block;width:100%;height:100%;min-height:44px;padding:0;overflow:hidden;background:var(--navy);border:0;cursor:zoom-in}
.area-image img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform .5s ease}
.area-grid>li:first-child .area-image img{object-position:46% center}
.area-home{position:absolute;z-index:2;top:16px;left:16px;padding:8px 11px;color:#fff;background:rgba(6,25,45,.8);border:1px solid rgba(255,255,255,.2);border-radius:4px;font-size:14px;font-weight:600;line-height:1.4}
.area-zoom{position:absolute;z-index:2;right:12px;top:12px;display:grid;place-items:center;width:44px;height:44px;color:#fff;background:rgba(6,25,45,.65);border:1px solid rgba(255,255,255,.3);border-radius:50%}
.area-zoom svg{width:20px;height:20px}
.area-copy{position:absolute;z-index:2;right:14px;bottom:18px;left:14px;pointer-events:none}
.area-copy h3{margin:0;color:#fff;font:800 clamp(1.125rem,3vw,1.7rem)/1.12 'Manrope',sans-serif;letter-spacing:-.035em;overflow-wrap:anywhere}
.area-grid>li:first-child .area-copy h3{font-size:clamp(2.2rem,9vw,3.5rem)}
.area-grid>li:nth-child(2) .area-copy h3{font-size:clamp(1.8rem,6vw,2.7rem)}
.area-landmark{display:flex;align-items:flex-start;gap:7px;margin:10px 0 0;color:#d4e6f0;font-size:14px;font-weight:500;line-height:1.5}
.area-landmark svg{flex-shrink:0;width:17px;height:19px;margin-top:1px}
.area-grid>li:nth-child(n+3) .area-landmark{display:none}
.area-communities{display:none;max-width:380px;margin:14px 0 0;padding-top:14px;color:#d4e0e9;border-top:1px solid rgba(255,255,255,.25);font-size:14px;font-weight:500;line-height:1.6}
.area-grid>li:first-child .area-communities{display:block}
.area-contact{display:flex;align-items:flex-start;flex-direction:column;gap:22px;margin-top:24px;padding-top:28px;border-top:1px solid rgba(9,35,63,.15)}
.area-contact h3{margin:0;color:var(--navy);font:700 clamp(1.35rem,2.4vw,1.75rem)/1.2 'Manrope',sans-serif;letter-spacing:-.03em}
.area-contact p{margin:10px 0 0;color:#52616c;font-size:14px;font-weight:500;line-height:1.65}
.area-contact a{width:100%;min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px 18px;color:#fff;background:var(--navy);border-radius:4px;font-size:14px;font-weight:700}
.area-contact a:focus-visible{outline:3px solid var(--blue);outline-offset:4px}
.area-image:focus-visible{outline:3px solid var(--sky);outline-offset:-5px}
.area-lightbox{position:fixed;z-index:2147483647;inset:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:18px;width:100%;height:100dvh;padding:max(20px,env(safe-area-inset-top)) max(20px,env(safe-area-inset-right)) max(20px,env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left));overflow-y:auto;overscroll-behavior:contain;color:#fff;background:rgba(3,14,25,.98);font-family:'Public Sans',sans-serif;font-weight:500}
.area-lightbox-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;width:100%;max-width:1536px;margin:auto}
.area-lightbox-header>div{min-width:0}
.area-lightbox-header p{margin:0 0 7px;color:#a9dff3;font-size:14px;font-weight:500;line-height:1.5}
.area-lightbox-header h2{margin:0;color:#fff;font:700 clamp(1.2rem,3vw,2rem)/1.2 'Manrope',sans-serif;letter-spacing:-.03em}
.area-lightbox-header .area-lightbox-communities{max-width:600px;margin:10px 0 0;color:#c7d7e2}
.area-lightbox button{flex-shrink:0;display:grid;place-items:center;width:48px;height:48px;padding:0;color:#fff;background:#15314a;border:1px solid rgba(169,223,243,.3);border-radius:50%;cursor:pointer}
.area-lightbox button>svg{width:24px;height:24px}
.area-lightbox button:focus-visible{outline:2px solid #a9dff3;outline-offset:4px}
.area-lightbox-image{min-height:0;display:flex;align-items:center;justify-content:center}
.area-lightbox-image img{display:block;width:100%;height:100%;max-width:1536px;max-height:100%;object-fit:contain}
.area-lightbox-footer{display:flex;align-items:center;justify-content:center;gap:28px}
.area-lightbox-footer p{min-width:60px;margin:0;color:#c7d7e2;font-size:14px;font-weight:500;text-align:center}
@media(min-width:700px){
  .area-heading{margin-bottom:40px}
  .area-grid{grid-template-columns:repeat(6,minmax(0,1fr));grid-template-rows:repeat(3,230px);gap:16px}
  .area-grid>li:nth-child(1){grid-column:1/4;grid-row:1/3}
  .area-grid>li:nth-child(2){grid-column:4/7;grid-row:1}
  .area-grid>li:nth-child(3){grid-column:4/7;grid-row:2}
  .area-grid>li:nth-child(4){grid-column:1/3;grid-row:3}
  .area-grid>li:nth-child(5){grid-column:3/5;grid-row:3}
  .area-grid>li:nth-child(6){grid-column:5/7;grid-row:3}
  .area-copy{right:22px;bottom:24px;left:22px}
  .area-grid>li:nth-child(n+3) .area-landmark{display:flex}
  .area-grid>li:first-child .area-copy h3{font-size:clamp(2.5rem,4.8vw,4rem)}
  .area-grid>li:nth-child(2) .area-copy h3{font-size:clamp(1.8rem,3vw,2.5rem)}
  .area-copy h3{font-size:clamp(1.2rem,2.4vw,1.6rem)}
  .area-contact{align-items:center;flex-direction:row;justify-content:space-between;gap:32px;margin-top:36px;padding-top:32px}
  .area-contact a{width:auto;flex-shrink:0}
  .area-lightbox{gap:24px;padding:32px}
}
@media(min-width:1050px){
  .area-heading{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);column-gap:72px;row-gap:28px;align-items:end;margin-bottom:48px}
  .area-heading>.index{grid-column:1/-1}
  .area-heading>p{padding-bottom:4px}
  .area-grid{grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:repeat(3,clamp(200px,16vw,240px));gap:18px}
  .area-grid>li:nth-child(1){grid-column:1/6;grid-row:1/4}
  .area-grid>li:nth-child(2){grid-column:6/13;grid-row:1}
  .area-grid>li:nth-child(3){grid-column:6/10;grid-row:2}
  .area-grid>li:nth-child(4){grid-column:10/13;grid-row:2}
  .area-grid>li:nth-child(5){grid-column:6/9;grid-row:3}
  .area-grid>li:nth-child(6){grid-column:9/13;grid-row:3}
  .area-grid>li:first-child .area-copy{right:32px;bottom:34px;left:32px}
  .area-grid>li:nth-child(2) .area-communities{display:block;max-width:none;margin-top:10px;padding-top:0;border-top:0}
  .area-grid>li:nth-child(2) .area-image img{object-position:center 46%}
}
@media(hover:hover) and (prefers-reduced-motion:no-preference){.area-image:hover img{transform:scale(1.035)}}
@media(prefers-reduced-motion:reduce){.area-image img{transition:none}}
</style>
