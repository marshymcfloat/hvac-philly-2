<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'
import CustomSelect from './CustomSelect.vue'

const emit = defineEmits(['form-active'])
const form = ref(null)
const draftPrepared = ref(false)
const details = reactive({ name: '', email: '', phone: '', area: '', service: '', message: '' })
const errors = reactive({})
const fields = [
  { name: 'name', label: 'Full name', type: 'text', autocomplete: 'name', placeholder: 'Your full name', required: true, maxLength: 120 },
  { name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', placeholder: 'you@example.com', required: true, maxLength: 254 },
  { name: 'phone', label: 'Phone number', type: 'tel', autocomplete: 'tel', placeholder: '(215) 555-0123', required: true, maxLength: 30 },
  { name: 'area', label: 'City or ZIP code', type: 'text', autocomplete: 'address-level2', placeholder: 'Where do you need service?', required: false, maxLength: 120 }
]
const serviceOptions = [
  { value: 'heating', label: 'Heating & boilers' },
  { value: 'cooling', label: 'Cooling & heat pumps' },
  { value: 'water-heaters', label: 'Water heaters' },
  { value: 'air-quality', label: 'Indoor air quality & controls' },
  { value: 'commercial', label: 'Commercial & property care' },
  { value: 'maintenance', label: 'Seasonal maintenance' },
  { value: 'not-sure', label: 'Not sure yet' }
]
const hasErrors = computed(() => Object.keys(errors).length > 0)
const draftLink = computed(() => {
  const service = serviceOptions.find(({ value }) => value === details.service)?.label || 'General HVAC service'
  const body = [
    `Name: ${details.name.trim()}`,
    `Email: ${details.email.trim()}`,
    `Phone: ${details.phone.trim()}`,
    `Service: ${service}`,
    `City or ZIP: ${details.area.trim() || 'Not provided'}`,
    '',
    'Request details:',
    details.message.trim() || 'No additional details provided.'
  ].join('\n')
  return `mailto:1superiorcomfortllc@gmail.com?subject=${encodeURIComponent(`HVAC service request - ${service}`)}&body=${encodeURIComponent(body)}`
})

const clearError = (field) => {
  delete errors[field]
  draftPrepared.value = false
}
const selectService = (value) => {
  if (serviceOptions.some((option) => option.value === value)) {
    details.service = value
    clearError('service')
  }
}
defineExpose({ selectService })
const onFormFocusout = (event) => {
  if (!form.value?.contains(event.relatedTarget)) emit('form-active', false)
}
onBeforeUnmount(() => emit('form-active', false))

const prepareEmail = async () => {
  Object.keys(errors).forEach((field) => delete errors[field])
  draftPrepared.value = false
  if (!details.name.trim()) errors.name = 'Enter your name.'
  if (!details.email.trim()) errors.email = 'Enter your email address.'
  else if (!form.value.elements.namedItem('email').validity.valid) errors.email = 'Enter a valid email address.'
  const phoneDigits = details.phone.replace(/\D/g, '')
  if (!details.phone.trim()) errors.phone = 'Enter your phone number.'
  else if (!/^[+\d\s().-]+$/.test(details.phone) || phoneDigits.length < 7 || phoneDigits.length > 15) errors.phone = 'Enter a valid phone number.'
  if (!serviceOptions.some(({ value }) => value === details.service)) errors.service = 'Choose a service, or select Not sure yet.'
  if (hasErrors.value) {
    await nextTick()
    document.getElementById(`contact-${Object.keys(errors)[0]}`)?.focus()
    return
  }
  window.location.href = draftLink.value
  draftPrepared.value = true
}
</script>

<template>
  <section id="contact" class="contact-section" aria-labelledby="contact-title">
    <div class="index"><span>07</span> Get in touch</div>
    <div class="contact-layout">
      <div class="contact-copy">
        <p class="contact-eyebrow">Repair, maintenance, or a new system?</p>
        <h2 id="contact-title">Let's talk<br /><span>comfort.</span></h2>
        <p class="contact-intro">Tell us what your home or business needs. Start an email request, or give us a call to discuss your service.</p>
        <dl class="contact-details">
          <div><dt>Call us <span>24/7 emergency service</span></dt><dd><a class="contact-phone" href="tel:2154166557">215-416-6557 <span aria-hidden="true">&nearr;</span></a></dd></div>
          <div><dt>Email</dt><dd><a href="mailto:1superiorcomfortllc@gmail.com">1superiorcomfortllc@gmail.com <span aria-hidden="true">&nearr;</span></a></dd></div>
          <div><dt>Based in Philadelphia</dt><dd><address>545 N 58th Street<br />Philadelphia, PA 19131, USA</address></dd></div>
        </dl>
      </div>

      <form ref="form" class="contact-form" novalidate aria-labelledby="contact-form-title" @submit.prevent="prepareEmail" @focusin="emit('form-active', true)" @focusout="onFormFocusout">
        <header><h3 id="contact-form-title">How can we help?</h3><p>Share a few details about your service needs.</p><p class="required-note">Required fields are marked with an asterisk.</p></header>
        <p v-if="hasErrors" class="form-error-summary" role="alert">Please check the highlighted fields.</p>
        <div class="contact-fields">
          <div v-for="field in fields" :key="field.name" class="contact-field">
            <label :for="'contact-' + field.name">{{ field.label }} <span v-if="field.required" class="required-mark" aria-hidden="true">*</span><span v-else class="optional-note">Optional</span></label>
            <input :id="'contact-' + field.name" v-model.trim="details[field.name]" :name="field.name" :type="field.type" :autocomplete="field.autocomplete" :placeholder="field.placeholder" :required="field.required" :maxlength="field.maxLength" :aria-invalid="errors[field.name] ? true : undefined" :aria-describedby="errors[field.name] ? 'contact-' + field.name + '-error' : undefined" @input="clearError(field.name)" />
            <p v-if="errors[field.name]" :id="'contact-' + field.name + '-error'" class="field-error">{{ errors[field.name] }}</p>
          </div>
          <div class="contact-field contact-field-wide">
            <label id="contact-service-label" for="contact-service">Service needed <span class="required-mark" aria-hidden="true">*</span></label>
            <CustomSelect id="contact-service" v-model="details.service" name="service" label-id="contact-service-label" :options="serviceOptions" placeholder="Choose a service" required :invalid="Boolean(errors.service)" :describedby="errors.service ? 'contact-service-error' : ''" @update:model-value="clearError('service')" />
            <p v-if="errors.service" id="contact-service-error" class="field-error">{{ errors.service }}</p>
          </div>
          <div class="contact-field contact-field-wide">
            <label for="contact-message">Tell us a little more <span class="optional-note">Optional</span></label>
            <textarea id="contact-message" v-model="details.message" name="message" rows="4" maxlength="2000" placeholder="What is happening with your system, or what are you planning?" @input="draftPrepared = false"></textarea>
          </div>
        </div>
        <button class="contact-submit" type="submit">Prepare email request <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 19 19 5M6 5h13v13" /></svg></button>
        <p class="contact-delivery-note">Opens your email app with these details. Review and send your request there.</p>
        <p v-if="draftPrepared" class="contact-draft-status" role="status">Email draft prepared. Send it from your email app to complete your request. <a :href="draftLink">Open draft again</a></p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact-section{position:relative;z-index:2;padding-bottom:64px;border-bottom:1px solid rgba(183,227,244,.2);font-weight:500;scroll-margin-top:130px}
.contact-section>.index{margin-bottom:30px;color:#b6c7d3;font-size:14px}
.contact-layout{display:grid;gap:36px}
.contact-copy{min-width:0}
.contact-eyebrow{margin:0 0 20px;color:#b6c7d3;font-size:14px;font-weight:500;line-height:1.6}
.contact-copy h2{margin:0;color:#fff;font:800 clamp(2.8rem,7vw,6rem)/.94 'Manrope',sans-serif;letter-spacing:-.065em}
.contact-copy h2>span{color:var(--sky)}
.contact-intro{max-width:440px;margin:24px 0 0;color:#b8cad7;font-size:16px;font-weight:500;line-height:1.7}
.contact-details{display:grid;gap:22px;margin:30px 0 0}
.contact-details>div{min-width:0}
.contact-details dt{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 14px;color:#d9e6ee;font-size:14px;font-weight:600;line-height:1.5}
.contact-details dt>span{color:#a9dff3;font-size:14px;font-weight:500}
.contact-details dd{margin:6px 0 0;color:#fff;font-size:14px;font-weight:500;line-height:1.65}
.contact-details a{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:44px;max-width:400px;padding:4px 0;overflow-wrap:anywhere}
.contact-details a>span{flex-shrink:0;color:#a9dff3;font-size:20px}
.contact-details .contact-phone{font:700 clamp(1.45rem,3vw,1.85rem)/1.3 'Manrope',sans-serif;letter-spacing:-.025em}
.contact-details address{color:#b8cad7;font-size:14px;font-weight:500;font-style:normal;line-height:1.7}
.contact-form{min-width:0;padding:24px 20px;color:#fff;background:#0c2840;border:1px solid rgba(169,223,243,.25);border-radius:10px}
.contact-form header{margin-bottom:24px}
.contact-form h3{margin:0;color:#fff;font:700 clamp(1.5rem,3vw,2rem)/1.2 'Manrope',sans-serif;letter-spacing:-.035em}
.contact-form header p{margin:10px 0 0;color:#bbcfdd;font-size:14px;font-weight:500;line-height:1.6}
.contact-form header .required-note{margin-top:14px;font-size:14px}
.contact-fields{display:grid;gap:20px}
.contact-field{min-width:0}
.contact-field label{display:flex;align-items:baseline;flex-wrap:wrap;gap:5px 8px;margin-bottom:9px;color:#f0f6fa;font-size:14px;font-weight:600;line-height:1.5}
.required-mark{color:#b7e5f7}
.optional-note{margin-left:auto;color:#a6bfce;font-size:14px;font-weight:500}
.contact-field input,.contact-field textarea{display:block;width:100%;min-width:0;min-height:52px;margin:0;padding:13px 15px;color:#fff;background:#071e32;border:1px solid #647f92;border-radius:5px;font:500 16px/1.5 'Public Sans',sans-serif;box-shadow:none}
.contact-field textarea{min-height:120px;resize:vertical}
.contact-field input::placeholder,.contact-field textarea::placeholder{color:#a5bac9;opacity:1}
.contact-field input:focus,.contact-field textarea:focus{border-color:#a9dff3;outline:2px solid rgba(169,223,243,.45);outline-offset:2px}
.contact-field input[aria-invalid=true]{border-color:#ffb8a9}
.contact-field .field-error,.form-error-summary{margin:8px 0 0;color:#ffbdad;font-size:14px;font-weight:500;line-height:1.5}
.form-error-summary{margin:0 0 20px}
.contact-submit{display:flex;align-items:center;justify-content:space-between;gap:20px;width:100%;min-height:52px;margin-top:24px;padding:14px 18px;color:var(--navy);background:var(--sky);border:1px solid var(--sky);border-radius:5px;font:700 14px/1.5 'Public Sans',sans-serif;cursor:pointer}
.contact-submit>svg{width:20px;height:20px;flex-shrink:0}
.contact-submit:hover{background:#c5ebf9}
.contact-delivery-note{margin:12px 0 0;color:#b9cddb;font-size:14px;font-weight:500;line-height:1.6}
.contact-draft-status{margin:20px 0 0;padding:14px;color:#d8f3ff;background:#153b53;border-left:2px solid #a9dff3;font-size:14px;font-weight:500;line-height:1.65}
.contact-draft-status a{min-height:44px;display:inline-flex;align-items:center;color:#fff;text-decoration:underline;text-underline-offset:4px}
.contact-section a:focus-visible,.contact-submit:focus-visible{outline:2px solid var(--sky);outline-offset:5px;border-radius:3px}
@media(min-width:600px){.contact-form{padding:32px}.contact-fields{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 18px}.contact-field-wide{grid-column:1/-1}}
@media(min-width:1000px){.contact-section{padding-bottom:84px}.contact-section>.index{margin-bottom:42px}.contact-layout{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:start;gap:clamp(44px,6vw,100px)}.contact-details{margin-top:40px;gap:26px}.contact-form{padding:36px}}
</style>
