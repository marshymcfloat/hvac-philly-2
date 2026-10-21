<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  labelId: { type: String, required: true },
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Choose an option' },
  required: Boolean,
  invalid: Boolean,
  describedby: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])
const root = ref(null)
const trigger = ref(null)
const listbox = ref(null)
const open = ref(false)
const activeIndex = ref(-1)
const selected = computed(() => props.options.find((option) => option.value === props.modelValue))
let search = ''
let searchTimer

const dismiss = () => {
  open.value = false
  search = ''
  clearTimeout(searchTimer)
}
const show = () => {
  activeIndex.value = Math.max(0, props.options.findIndex((option) => option.value === props.modelValue))
  open.value = true
}
const choose = (index) => {
  if (props.options[index]) emit('update:modelValue', props.options[index].value)
  dismiss()
}
const onKeydown = (event) => {
  const last = props.options.length - 1
  if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) {
    event.preventDefault()
    const wasOpen = open.value
    if (!wasOpen) show()
    if (event.key === 'Home') activeIndex.value = 0
    else if (event.key === 'End') activeIndex.value = last
    else if (event.altKey && event.key === 'ArrowUp' && wasOpen) choose(activeIndex.value)
    else if (wasOpen) {
      const step = event.key === 'PageDown' ? 10 : event.key === 'PageUp' ? -10 : event.key === 'ArrowDown' ? 1 : -1
      activeIndex.value = Math.max(0, Math.min(last, activeIndex.value + step))
    }
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (open.value) choose(activeIndex.value)
    else show()
    return
  }
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    event.stopPropagation()
    dismiss()
    return
  }
  if (event.key === 'Tab') {
    if (open.value) choose(activeIndex.value)
    return
  }
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
  event.preventDefault()
  if (!open.value) show()
  search += event.key.toLocaleLowerCase()
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { search = '' }, 700)
  const repeated = [...search].every((character) => character === search[0])
  const query = repeated ? search[0] : search
  const start = repeated ? activeIndex.value + 1 : 0
  for (let offset = 0; offset < props.options.length; offset += 1) {
    const index = (start + offset) % props.options.length
    if (props.options[index].label.toLocaleLowerCase().startsWith(query)) {
      activeIndex.value = index
      break
    }
  }
}

watch([open, activeIndex], async () => {
  await nextTick()
  const list = listbox.value
  const option = list?.children[activeIndex.value]
  if (!open.value || !option) return
  if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop
  else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
    list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight
  }
})

const onOutsidePointer = (event) => {
  if (open.value && !root.value?.contains(event.target)) dismiss()
}
const onFocusout = (event) => {
  if (!root.value?.contains(event.relatedTarget)) dismiss()
}
onMounted(() => document.addEventListener('pointerdown', onOutsidePointer))
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onOutsidePointer)
  clearTimeout(searchTimer)
})
</script>

<template>
  <div ref="root" class="custom-select" :class="{ 'is-open': open }" @focusout="onFocusout">
    <input type="hidden" :name="name" :value="modelValue" />
    <button :id="id" ref="trigger" type="button" class="select-trigger" role="combobox" aria-haspopup="listbox" :aria-labelledby="labelId" :aria-controls="id + '-listbox'" :aria-expanded="open" :aria-activedescendant="open && activeIndex >= 0 ? id + '-option-' + activeIndex : undefined" :aria-required="required || undefined" :aria-invalid="invalid || undefined" :aria-describedby="describedby || undefined" @click="open ? dismiss() : show()" @keydown="onKeydown">
      <span :class="{ 'select-placeholder': !selected }">{{ selected?.label || placeholder }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    <ul v-show="open" :id="id + '-listbox'" ref="listbox" class="select-listbox" role="listbox" :aria-labelledby="labelId" data-lenis-prevent>
      <li v-for="(option, index) in options" :id="id + '-option-' + index" :key="option.value" role="option" :aria-selected="modelValue === option.value" :class="{ 'is-active': activeIndex === index, 'is-selected': modelValue === option.value }" @pointermove="activeIndex = index" @mousedown.prevent @click="choose(index)">
        <span>{{ option.label }}</span><svg v-if="modelValue === option.value" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.custom-select{position:relative;min-width:0;font-family:'Public Sans',sans-serif;font-weight:500}
.custom-select.is-open{z-index:10}
.select-trigger{width:100%;min-height:52px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 15px;color:#fff;background:#071e32;border:1px solid #647f92;border-radius:5px;font:500 16px/1.5 'Public Sans',sans-serif;text-align:left;cursor:pointer}
.select-trigger>span{min-width:0}
.select-placeholder{color:#a5bac9}
.select-trigger>svg{width:20px;height:20px;flex-shrink:0;color:#a9dff3;transition:transform .2s ease}
.is-open .select-trigger>svg{transform:rotate(180deg)}
.is-open .select-trigger,.select-trigger:focus-visible{border-color:#a9dff3;outline:2px solid rgba(169,223,243,.45);outline-offset:2px}
.select-trigger[aria-invalid=true]{border-color:#ffb8a9}
.select-listbox{position:absolute;z-index:20;top:calc(100% + 8px);right:0;left:0;max-height:min(296px,44dvh);margin:0;padding:6px;overflow-y:auto;overscroll-behavior:contain;color:#fff;background:#102e48;border:1px solid #648aa2;border-radius:7px;box-shadow:0 18px 36px rgba(0,0,0,.35);list-style:none;scrollbar-width:thin;scrollbar-color:#7196ad #102e48;-webkit-overflow-scrolling:touch}
.select-listbox li{min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 12px;border-radius:4px;font-size:14px;font-weight:500;line-height:1.5;cursor:pointer}
.select-listbox li+li{margin-top:2px}
.select-listbox .is-selected{color:#bceafa;background:#173f5b}
.select-listbox .is-active{color:#fff;background:#255774;outline:1px solid #83b5d0;outline-offset:-1px}
.select-listbox svg{width:19px;height:19px;flex-shrink:0;color:#bceafa}
@media(prefers-reduced-motion:reduce){.select-trigger>svg{transition:none}}
</style>
