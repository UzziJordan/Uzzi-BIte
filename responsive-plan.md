# Responsive Layout Refactoring Plan

## Objective
Make both the Admin and Customer frontends fully responsive across mobile, tablet, and desktop views.

## Scope of Work

### 1. Admin Frontend
- **DashBoardLayout.jsx & Sidebar.jsx**:
  - Implement a mobile header with a Hamburger Menu icon.
  - Make the Sidebar slide in from the left on mobile devices (hidden by default) and remain fixed/visible on desktop (`md:flex`).
  - Add an overlay when the sidebar is open on mobile.
- **Dashboard.jsx (Stats & Recent Orders)**:
  - Convert the top stat cards from `grid-cols-4` to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
  - Add horizontal scrolling (`overflow-x-auto` & `min-w-max`) to the Recent Orders table so it doesn't break the layout on small screens.
  - Adjust padding (`p-4 md:p-10`).
- **Meals.jsx & Tables.jsx**:
  - Convert grids to `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- **Orders.jsx**:
  - Update the order cards container to be flexible or use responsive grids.
- **Stats.jsx & Settings.jsx**:
  - Update main grids from fixed columns to responsive (`grid-cols-1 md:grid-cols-2`, etc.).
  - Ensure tables have horizontal scroll.
- **Login.jsx**:
  - Stack the split-screen design on mobile (`flex-col md:flex-row`).
  - Hide or resize the background image appropriately.

### 2. Customer Frontend
- **Menu.jsx**:
  - Adjust the grid for meals (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-6`).
  - Improve the header and category filter padding for mobile.
- **Cart.jsx**:
  - Ensure the sliding panel is `w-full md:w-96` so it doesn't overflow mobile screens.
- **Login.jsx**:
  - Make the table selection grid responsive (`grid-cols-3 sm:grid-cols-4`).
- **Onboarding.jsx & MyOrders.jsx**:
  - Ensure padding and text sizes scale down on mobile (`text-2xl md:text-4xl`).

## Implementation Strategy
We will execute these changes sequentially using file replacements. Because of the volume, I will carefully apply Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to the existing class strings in each file.