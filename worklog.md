---
Task ID: 1
Agent: main
Task: Redesign birthday landing page with two-screen approach and scroll-triggered reveals

Work Log:
- Read current page.tsx, layout.tsx, and globals.css to understand existing state
- Redesigned Screen 1 (splash): Removed circle, title, date - kept ONLY the golden heart with pulse animation and "Toca para abrir" text on dark background
- Redesigned Screen 2 (landing): All elements (date, title, letter paragraphs, heart button) now reveal with scroll-triggered animations using IntersectionObserver
- Added blur+scale+glow transition effects for "magical dopaminergic" reveal feel
- Added significant spacing between sections: date takes 85vh, title has 6rem padding, heart has 6rem padding
- Audio autoplay triggers on splash screen tap (user gesture requirement satisfied)
- IntersectionObserver settings: threshold 0.2, rootMargin -80px, with 200-600ms staggered delays
- Updated layout.tsx for dark background to prevent FOUC
- Verified with Agent Browser: splash screen shows only heart+text, scroll reveals work progressively

Stage Summary:
- Screen 1: Minimal splash with golden heart + "Toca para abrir" (no circle, no extra elements)
- Screen 2: Scroll-triggered progressive reveals with blur/scale/glow effects
- Each letter paragraph reveals independently as user scrolls
- Audio plays on splash tap (reliable mobile autoplay)
- No FOUC on page load
- No console errors
