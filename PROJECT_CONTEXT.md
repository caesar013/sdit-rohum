# PROJECT: Noble Elementary School Website (MVP)
# DEADLINE: 1 Week
# ROLE: Senior Frontend Developer (Vue.js + Tailwind)

## TECH STACK
- Framework: Vue 3 (Composition API, <script setup>)
- Build Tool: Vite
- CSS Framework: Tailwind CSS (v3+)
- Node Version: Latest Stable

## ARCHITECTURE RULES
1. **Design System Source of Truth**: 
   - NEVER use arbitrary hex codes in components. 
   - ALWAYS use `tailwind.config.js` theme colors: `primary`, `secondary`, `neutral`, `light`.
   - If a new color is needed, add it to `tailwind.config.js` first.

2. **Component Structure**:
   - Use Single File Components (.vue).
   - Use `<script setup>`.
   - Keep logic simple. If a component exceeds 200 lines, refactor.

3. **MVP Constraints**:
   - No complex state management (Pinia/Vuex) unless absolutely necessary.
   - No complex animations or experimental features.
   - Focus on "Desktop First" for the MVP delivery, ensure mobile doesn't break, but optimize later.

## FILE STRUCTURE
- src/components/: Reusable UI blocks (Navbar, Hero, Footer, Card).
- src/views/: (If routing is added later) Full page layouts.
- src/assets/: Static images/logos.

## CURRENT TASK
Building the Homepage. Key sections:
1. Navbar (Sticky, Logo + Links + CTA).
2. Hero (Headline + 2 Buttons).
3. Features Grid (Why Choose Us).
4. Footer (Links + Contact Info).

## INSTRUCTION FOR COPILOT
- When generating code, prioritize readability over cleverness.
- Always assume Tailwind classes are preferred over custom CSS.
- If I ask for a component, scaffold the full `<template>`, `<script setup>`, and styling.