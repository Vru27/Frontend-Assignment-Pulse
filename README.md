# Pulse - Analytics Dashboard

Pulse is a responsive analytics dashboard built using **Next.js App Router** and **TypeScript**. It allows users to browse products, search, filter, sort, and view product details. It also includes a dashboard with charts and summary cards to visualize the data.

The main goal of this project was to build a clean, responsive, and user-friendly dashboard while following modern React and Next.js practices.

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- Recharts
- React Window
- ESLint
- Prettier

---

## Why I Chose These Libraries

### Next.js App Router

I chose Next.js App Router because it provides a clean routing structure and supports features like Server Components, layouts, loading states, and dynamic routes.

### React Query

I used React Query to handle API requests because it manages loading, error, and caching automatically. Since this app has search, filters, pagination, and product details, it helped reduce a lot of manual state management.

### Tailwind CSS

Tailwind made it easy to build a responsive UI quickly while keeping the styling consistent.

### shadcn/ui

I used shadcn components to speed up development and because they are accessible and easy to customize.

### Recharts

Recharts was used to build the dashboard charts because it is simple to use and works well with React.

### React Window

I added React Window to efficiently render long lists and improve performance when displaying many products.

---

## API Used

I have used DummyJSON Products API.

https://dummyjson.com/products

The API provides products, categories, search, pagination, and product details.

---

## Features

### Explore Page

- Product listing
- Search with debounce
- Category filter
- Sorting
- Pagination
- URL query parameters for search, filter, sorting, and pagination
- Responsive layout

### Product Details

- Dynamic route for each product
- Product information page
- Handles invalid product IDs

### Dashboard

- Summary cards
- Category distribution chart
- Product analytics charts

### UI States

The application handles:

- Loading state using skeletons
- Error state with retry option
- Empty state when no data is available

### Responsive Design

The application works on mobile, tablet, and desktop screens.

### Accessibility

Basic accessibility improvements include:

- Semantic HTML
- Keyboard navigation
- Labels for form inputs
- Alt text for images
- Visible focus states

---

## Rendering Strategy

I used both Server Components and Client Components.

Interactive parts like search, filters, sorting, pagination, and charts are Client Components because they require user interaction.

For the rest of the application, I used Server Components where possible to keep the initial load lightweight.

---

## Project Structure

```
app/
components/
lib/
public/
```

I kept the project structure simple by separating reusable components, API functions, and utility files so they are easier to maintain.

---

## Performance Optimizations

Some optimizations I implemented are:

- Debounced search
- React Query caching
- Virtualized product list using React Window
- Next.js Image component for optimized images

---

## Setup

Clone the repository

```bash
git clone https://github.com/Vru27/Frontend-Assignment-Pulse.git
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Project Architecture

I separated the application into reusable components and utility functions instead of keeping everything inside a single page.

React Query is responsible for data fetching and caching.

URL query parameters are used as the source of truth for search, filter, sorting, and pagination so users can refresh the page or share the URL without losing the current state.

---

## Trade-offs

Since this assignment had a limited time, I focused more on completing all the core requirements with clean code instead of adding every bonus feature.

I preferred building reusable components so the code stays easier to maintain.

---

## If I Had More Time

I would like to add:

- More unit and integration tests
- Playwright end-to-end testing
- Dark mode
- Optimistic updates for favourites
- GitHub Actions for CI
- More dashboard charts and analytics

---

## Time Spent

I worked on this assignment for a day.

Most of the time went into building the explore page, managing URL state, creating reusable components, handling different UI states, and making the application responsive.

---

## Final Notes

While building this project, I focused on writing clean and reusable code rather than just completing the features. I also tried to keep the UI responsive, accessible, and easy to navigate.

If I were continuing this project, I would add more testing, improve analytics, and further optimize performance for larger datasets.