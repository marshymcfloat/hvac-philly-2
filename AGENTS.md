# Frontend Rules

These instructions apply to all files in this repository.

## Typography

- All user-visible text must have a computed font size of at least `14px` (`0.875rem`).
- All user-visible text must use a font weight of at least `500` (`medium`).
- Do not introduce smaller or lighter text through component styles, utility classes, inline styles, responsive variants, or inherited styles.
- When editing existing UI, preserve these minimums and correct violations in the code being changed.

## Galleries and Lightboxes

- Every gallery image must be interactive and open in a lightbox when clicked.
- Implement lightboxes as Vue components and render them into `body` with `<Teleport to="body">` so ancestor stacking contexts cannot constrain them.
- The lightbox must sit above every other interface element. Use the maximum practical z-index: `z-index: 2147483647`.
- Add `data-lenis-prevent` to the fixed lightbox overlay container. Apply the same attribute to all other fixed overlay containers, including modals, drawers, and sheets.
- Pair every fixed overlay with the Vue `useLockScroll()` composable from `src/composables/useLockScroll.ts`. The composable must call `lenis.stop()` and set `document.body.style.overflow = 'hidden'` while the overlay is open, then call `lenis.start()` and restore the previous body overflow value when it closes or the component unmounts.
- Keep `data-lenis-prevent` on the scrollable overlay container because Lenis checks that attribute before its stopped state. This allows native scrolling inside the overlay while keeping the page locked.

## Mobile Responsiveness

When asked to improve a section's overall visuals or layout, treat its mobile presentation as a distinct design task rather than a compressed desktop layout.

- Use mobile-first styles and content-driven breakpoints. Prefer fluid sizing, CSS Grid/Flexbox, container queries where appropriate, and `dvh`/`svh` instead of `vh` for viewport-height layouts.
- Keep the main content centered within the viewport using balanced inline padding and suitable width constraints. This does not require center-aligning all text.
- Verify at common narrow widths that content never clips, overlaps, causes accidental page-level horizontal overflow, or touches the viewport edges.
- Shorten or summarize long copy on mobile when it improves clarity. Preserve its meaning and keep the full version on larger screens when useful.
- Hide decorative, redundant, or secondary elements on mobile when they create clutter. Do not hide content or controls required to understand or use the interface.
- A mobile section may use a substantially different composition, ordering, or layout from its desktop version when that produces a clearer result. Preserve accessible DOM order.
- Do not automatically stack every item vertically. For short groups of roughly 3-4 items, consider a horizontal scroll rail when it makes better use of the viewport.
- A horizontal scroll rail should reveal part of the next item as a visual affordance. Give the first item intentional left inset, the last item matching right inset, and every item consistent spacing.
- Horizontal rails must use touch-friendly scrolling and must not make the entire page overflow horizontally.
- Interactive controls must retain a minimum `44px by 44px` touch target.

## Mobile Navigation Sheet

- On mobile, replace the desktop navigation with an accessible burger button that opens a full-viewport navigation sheet.
- Implement the sheet as a Vue component rendered with `<Teleport to="body">`. Follow the fixed-overlay, maximum z-index, `data-lenis-prevent`, and `useLockScroll()` rules above.
- Structure the sheet with exactly three parent regions: `header`, `navlinks`, and `footer`. Use a `100dvh` layout with rows sized `auto minmax(0, 1fr) auto` and prevent the sheet itself from scrolling.
- Keep the header fixed at the top of the sheet. It must contain only the site logo and an accessible close (`X`) button.
- Keep the footer fixed at the bottom of the sheet. Move relevant top-bar content such as contact or address information into it. If no such content exists, leave the footer empty; do not invent filler content.
- Place all navigation links in the middle `navlinks` region. Only this region may become vertically scrollable when its content exceeds the available height. Use a Vue-compatible scroll-area component, such as the shadcn-vue ScrollArea, or native `overflow-y: auto` with equivalent behavior.
- Desktop dropdown navigation must become accessible accordions inside the mobile sheet. Accordion triggers must expose their expanded state and support keyboard interaction.
- Opening an accordion may increase only the scrollable navlinks content. It must never move the header or footer from their positions.
- The burger and close buttons must have accessible labels and meet the minimum touch-target rule.
