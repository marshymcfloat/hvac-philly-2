<script setup>
import { featuredServices, supportingServices } from '../data/services'

const emit = defineEmits(['request-service'])
const pad = (value) => String(value).padStart(2, '0')
</script>

<template>
  <section id="services" class="services section" aria-labelledby="services-title">
    <div class="shell">
      <header class="services-heading split-heading">
        <div class="index"><span>04</span> Our services</div>
        <div><h2 id="services-title">Every season.<br /><span>Every system.</span></h2><p>From urgent repairs to planned upgrades, practical HVAC care for Philadelphia homes and businesses.</p></div>
        <div class="count"><strong>03</strong><span>Featured<br />service groups</span></div>
      </header>

      <ol class="category-list" aria-label="Featured service groups" tabindex="0">
        <li v-for="(category, i) in featuredServices" :key="category.id">
          <article :id="'service-' + category.id" class="category-card" :aria-labelledby="'service-title-' + category.id">
            <header>
              <span class="big-number" aria-hidden="true">{{ pad(i + 1) }}</span>
              <p>{{ category.label }}</p>
              <h3 :id="'service-title-' + category.id">{{ category.title }}</h3>
              <small>{{ category.description }}</small>
            </header>
            <div class="category-placeholder service-photo placeholder"><img :src="category.image" :alt="category.alt" :width="category.imageWidth" :height="category.imageHeight" loading="lazy" decoding="async" /></div>
            <div class="directory">
              <p>How we can help</p>
              <ul><li v-for="(service, j) in category.services" :key="service"><small aria-hidden="true">{{ pad(j + 1) }}</small><strong>{{ service }}</strong></li></ul>
              <a class="directory-cta" href="#contact" :aria-label="'Request service for ' + category.title" @click="emit('request-service', category.id)">Request service <span aria-hidden="true">&nearr;</span></a>
            </div>
          </article>
        </li>
      </ol>

      <div class="supporting-services">
        <p class="supporting-label">We also help with</p>
        <div class="supporting-grid">
          <article v-for="service in supportingServices" :id="'service-' + service.id" :key="service.id" class="supporting-service" :aria-labelledby="'service-title-' + service.id">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path v-for="path in service.icon" :key="path" :d="path" /></svg>
            <div><h3 :id="'service-title-' + service.id">{{ service.title }}</h3><p>{{ service.description }}</p></div>
          </article>
        </div>
      </div>
      <div class="section-footer"><p>No heat or cooling? Call us 24/7.</p><a href="tel:2154166557">215-416-6557 <span aria-hidden="true">&nearr;</span></a></div>
    </div>
  </section>
</template>

<style scoped>
.services{font-weight:500}
.category-list{width:calc(100% + 40px);display:flex;gap:14px;margin:0 -20px;padding:0 20px 18px;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x mandatory;scroll-padding-inline:20px;-webkit-overflow-scrolling:touch}
.category-list>li{flex:0 0 min(85%,360px);min-width:0;scroll-snap-align:start}
.category-card{position:relative;height:100%;display:flex;flex-direction:column;min-width:0;min-height:0;scroll-margin-top:130px;border-radius:8px}
.category-card>header{min-height:0;padding:24px}
.category-card header>p{position:relative;margin:0;font-size:14px;line-height:1.5;letter-spacing:.08em}
.category-card h3{position:relative;max-width:none;margin:18px 0 16px;font-size:clamp(1.75rem,7vw,2.5rem);line-height:1.05;overflow-wrap:normal}
.category-card header>small{position:relative;font-size:14px;font-weight:500;line-height:1.65}
.category-card .big-number{display:none}
.category-card .service-photo{flex-shrink:0;min-height:0;aspect-ratio:16/10;overflow:hidden}
.service-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.category-card .directory{flex:1;min-width:0;padding:22px 24px}
.category-card .directory>p{font-size:14px}
.category-card .directory li{min-height:54px;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:6px;padding:9px 0;border-bottom:1px solid rgba(11,35,65,.14);font-size:14px;line-height:1.5}
.category-card .directory li small{font-size:14px;color:#536b7e}
.category-card .directory li strong{font-weight:600}
.category-card .directory-cta{min-height:48px;align-items:center;gap:14px;margin-top:auto;padding:14px 16px;font-size:14px}
.category-card .directory ul{margin-bottom:24px}
.supporting-services{margin-top:32px}
.supporting-label{margin:0 0 18px;color:#a9dff3;font-size:14px;font-weight:600}
.supporting-grid{display:grid;gap:12px}
.supporting-service{display:grid;grid-template-columns:32px minmax(0,1fr);gap:16px;padding:22px;border:1px solid rgba(169,223,243,.2);border-radius:6px;scroll-margin-top:130px}
.supporting-service>svg{width:32px;height:32px;color:#a9dff3}
.supporting-service h3{margin:0;color:#fff;font:700 18px/1.25 'Manrope',sans-serif;letter-spacing:-.02em}
.supporting-service p{margin:9px 0 0;color:#b7c9d6;font-size:14px;font-weight:500;line-height:1.65}
.section-footer a{min-height:44px;display:inline-flex;align-items:center;gap:14px}
.category-list:focus-visible,.services a:focus-visible{outline:2px solid var(--sky);outline-offset:5px}
@media(min-width:651px){
  .category-list{width:100%;display:grid;gap:24px;margin:0;padding:0;overflow:visible}
  .category-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);height:auto}
  .category-card>header,.category-list>li:nth-child(2) .category-card>header{grid-column:1;grid-row:1;padding:30px}
  .category-card .service-photo,.category-list>li:nth-child(2) .service-photo{grid-column:2;grid-row:1;aspect-ratio:auto;min-height:100%}
  .category-card .directory,.category-list>li:nth-child(2) .directory{grid-column:1/-1;grid-row:2;padding:28px 30px}
  .category-card h3{font-size:clamp(2rem,3.4vw,3.3rem)}
  .category-card .directory ul{display:grid;grid-template-columns:1fr 1fr;column-gap:24px}
  .category-card .directory-cta{width:max-content;min-width:220px}
  .supporting-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(min-width:1050px){
  .category-card{grid-template-columns:minmax(0,.85fr) minmax(0,1fr) minmax(0,1fr);min-height:390px}
  .category-card>header,.category-list>li:nth-child(2) .category-card>header{grid-column:1;grid-row:1}
  .category-card .service-photo,.category-list>li:nth-child(2) .service-photo{grid-column:2;grid-row:1}
  .category-card .directory,.category-list>li:nth-child(2) .directory{grid-column:3;grid-row:1;justify-content:center}
  .category-list>li:nth-child(2) .category-card>header{grid-column:3}
  .category-list>li:nth-child(2) .directory{grid-column:1}
  .category-card .directory ul{display:block}
  .category-card .directory-cta{width:100%;min-width:0;margin-top:auto}
  .category-card header>small{margin-top:auto}
  .category-card .big-number{display:block}
  .supporting-services{margin-top:36px}
}
</style>
