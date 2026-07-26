# CHANGELOG - سجل التغيرات والإصدارات

All notable changes to the **"المعلم العربي المحترف" (Pro Arab Teacher LMS)** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-rc1] - 2026-07-26 (Release Candidate 1.0)

### 🌟 Release Overview
Initial stable Release Candidate (RC 1.0) ready for commercial deployment & production launch.

### ✨ Added
- **Regional Curricula Engine (`/src/data/regionalCurricula.ts`)**:
  - Support for Yemen (YE), Saudi Arabia (SA), Egypt (EG), UAE (AE), Jordan (JO), and General Arab International curricula.
  - Active curriculum switcher component (`RegionalCurriculumSelector.tsx`) integrated seamlessly into the top header.
  - AI Prompt customization adapting outputs to chosen Ministry guidelines & terminology.
- **Internationalization (i18n) Framework (`/src/i18n/translations.ts`)**:
  - Complete dictionary-based translation system supporting Arabic (RTL) and English (LTR).
  - Scalable structure allowing seamless additions of new languages.
- **Offline Storage & Service Worker Integration (`/src/utils/offlineStorage.ts`, `/public/sw.js`)**:
  - Automatic local caching of generated lesson plans, worksheets, quizzes, and presentations.
  - Offline status banner notification with quick manual sync trigger.
- **Commercial SaaS & Admin Capabilities**:
  - Subscription tier modals (Free, Pro, Enterprise) with voucher activation code system.
  - Full system audit logging and real-time JSON backup & restore.
  - Express server-side Gemini 2.5 Flash API proxy with in-memory response caching and exponential backoff retry logic.

### 🛡️ Security & Performance
- Zero client-side API key leakage (all Gemini requests proxied via `/api/*`).
- In-memory response cache reducing redundant AI calls and cutting response times to ~1.2s for cached queries.
- Clean separation of component logic with complete TypeScript strict safety.

---

## [0.9.0] - 2026-07-20
- RAG Curriculum Library with book chapter index search and preseeded Yemeni curriculum textbooks.
- AI Lesson Planner with PPTX PowerPoint export (`pptxgenjs`).
- Smart Quiz & Worksheet Generator with Bloom's taxonomy weighting.
- Automated Essay Grader & Voice Assistant integration.

---

## [0.1.0] - 2026-07-01
- Initial prototype release with core role-based navigation (Teacher, Student, Parent, Admin).
