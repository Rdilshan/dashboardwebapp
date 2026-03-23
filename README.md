# Industrial Training Portal

This project is a `Next.js 16` App Router frontend for an industrial training portal. It rebuilds the provided HTML/CSS screens as reusable `Tailwind CSS` pages and uses `lucide-react` for all icons.

## Stack

- Next.js 16.2.1
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

## Available Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page for the training portal |
| `/submit-cv` | Student CV submission form |
| `/student-login` | Student sign-in page |
| `/student-signup` | Student registration page |
| `/forgot-password` | Student password recovery page |
| `/student-dashboard` | Student document submission dashboard |
| `/login` | Admin login page |
| `/admin-hub` | Admin hub / coordinator landing page |
| `/dashboard` | Admin CV submission dashboard |
| `/admin-setting` | Admin password settings page |
| `/admin-matrix` | Admin submission matrix page |

## Current Status

- The UI is implemented in Tailwind and matches the supplied static HTML/CSS references.
- Icons were migrated to `lucide-react`.
- Several pages include client-side interactions such as filtering, modals, toasts, upload states, and CSV export.
- Authentication, database persistence, file storage, and API integration are not connected in this repo yet.
- Some dashboards currently use local mock data and simulated success flows.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
app/
  page.tsx                 # landing page
  submit-cv/              # CV submission UI
  student-login/          # student login UI
  student-signup/         # student signup UI
  forgot-password/        # student forgot password UI
  student-dashboard/      # student submissions dashboard
  login/                  # admin login UI
  admin-hub/              # admin landing page
  dashboard/              # admin CV dashboard
  admin-setting/          # admin settings UI
  admin-matrix/           # admin submission matrix UI
```

## Notes

- Styling is utility-first through Tailwind rather than the original standalone CSS files.
- Global motion helpers are defined in `app/globals.css`.
- The app currently focuses on the frontend layer and route structure.
