
# Skatemap

Skatemap is a full-stack web application for the global skateboarding community. It provides an interactive map of skateboarding spots around the world, allowing users to discover, add, and manage locations from any country. The platform combines a cinematic frontend experience with a robust backend built for scale.

---

## Overview

The core idea is simple: every skater has local knowledge that the rest of the world does not have access to. Skatemap turns that knowledge into a shared, searchable, and visually rich global database of spots. Users can browse spots on an interactive globe, filter by continent, risk level, and type, submit new spots for review, and save their favorites for quick access.

The platform includes a full role-based moderation system. Submitted spots go through a review pipeline before becoming publicly visible, ensuring data quality across the map.

---

## Features

**Public**
- Interactive 3D globe built with MapLibre GL, rendered as a WebGL sphere
- Filter spots by continent, risk level, spot type, and free-text search
- All filtering happens client-side after a single API call, with zero subsequent requests
- Spot detail panel with media gallery, location info, and type tags
- Grid view with the same filtering system and frontend pagination

**Authenticated users**
- Submit new spots with photos and videos, uploaded via Cloudinary
- Save spots to a personal favorites list
- Manage your own spots: edit, delete, and track approval status
- View spots filtered by status: approved, pending, unapproved

**Administrators**
- Full spot management dashboard
- Approve, reject, or revert spots to pending status
- Moderation queue for incoming requests

---

## Tech Stack

**Frontend**
- Next.js 14 with App Router
- React with Zustand for global state management
- GSAP for all page transitions, entrance animations, and interactive effects
- MapLibre GL for the WebGL globe and map rendering
- Tailwind CSS

---

## Architecture decisions

**Single-fetch filtering**
Rather than making a new API call for every filter change, the frontend fetches all approved spots once on mount and stores them in Zustand. All filtering, searching, and pagination then happen in memory with no further network requests. This eliminates redundant calls and makes filters feel instantaneous.

**Local state updates**
After mutations like deleting a spot or approving a request, the frontend updates its local array directly rather than refetching. A delete removes the item by id, a status change maps over the array and updates only the affected object. This keeps the UI responsive and reduces backend load.


---

## Deployment

The backend is deployed on Railway as a containerized Spring Boot application. The frontend is deployed on Vercel. Both environments are configured via environment variables with no hardcoded credentials.

Backend repository: https://github.com/DattolaFrancesco/skatemap-be