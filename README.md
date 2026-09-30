# ShopDemo — Next.js Product Catalogue & Cart

A small e-commerce front end built with **Next.js 16 (App Router)**, **TypeScript** and **Redux Toolkit**.
It has hardcoded-credential login, route protection in Next.js Middleware (called Proxy in Next.js 16),
a searchable product catalogue from a public REST API, product detail pages and a Redux-powered cart.

## Tech stack

| Concern          | Choice                                                         |
| ---------------- | -------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router), React 19                              |
| Language         | TypeScript (strict mode, no `any`)                             |
| State            | Redux Toolkit + React Redux                                    |
| Route protection | Next.js Proxy (`src/proxy.ts`), formerly called Middleware      |
| Data             | [DummyJSON](https://dummyjson.com/docs/products) REST API      |
| Styling          | Plain CSS (`src/app/globals.css`)                              |

## Getting started

### Prerequisites

- Node.js **20.9+** (developed on Node 22)
- npm

### Setup

```bash
git clone https://github.com/mani30360/nextjs-assessment.git
cd nextjs-assessment
npm install
```

The repository includes a `.env` file with working demo values, so no extra setup is needed.
To use your own values, edit `.env` (see `.env.example`):

| Variable                   | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Product API base URL (`https://dummyjson.com`)        |
| `AUTH_SECRET`              | Secret used to sign the session cookie (HMAC-SHA256)  |

> The committed `AUTH_SECRET` is for the demo only. Use a long random value in any real deployment.

### Run

```bash
npm run dev        # development server at http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Quality checks:

```bash
npm run lint
npm run typecheck
```

### Demo login

| Email            | Password   |
| ---------------- | ---------- |
| `admin@test.com` | `admin123` |

## Features

- **Login** (`/login`): validates the fields in the form and shows an error for wrong credentials. After you sign in it goes to `/products`, or back to the protected page you first tried to open.
- **Route protection**:
  - Unauthenticated users who open `/products`, `/products/[id]` or `/cart` are sent to `/login`.
  - Authenticated users who open `/login` (or `/`) are sent to `/products`.
- **Product listing** (`/products`): shows each product's image, name, category, price and an Add to Cart button. You can search by text (debounced and done by the API), filter by category and sort by price or rating. Loading, error (with retry) and empty-result states are handled.
- **Product details** (`/products/[id]`): shows the image, name, brand and category, description, price, rating, stock and an Add to Cart button. It has its own loading, error and not-found (404) screens.
- **Cart** (`/cart`): lists the items in the cart. You can increase or decrease quantities (going below 1 removes the item), remove an item or clear the cart. It shows the total quantity and total amount. The header shows a live item count, and the cart is saved in `localStorage` so it survives a page reload.
- **Logout**: clears the session cookie and returns you to `/login`.

## Project structure

```
src/
├── proxy.ts                    # Route protection (Next.js 16's name for middleware.ts)
├── app/                        # Routes only; logic lives in components/, store/, services/
│   ├── layout.tsx              # Reads the session cookie and passes the user to the Redux store
│   ├── page.tsx                # "/" goes to /products
│   ├── login/page.tsx
│   ├── products/page.tsx
│   ├── products/[id]/          # page, loading, error, not-found
│   ├── cart/page.tsx
│   └── api/auth/{login,logout}/route.ts
├── components/
│   ├── auth/                   # LoginForm
│   ├── cart/                   # CartView, CartItemRow, QuantityControl
│   ├── layout/                 # Header
│   ├── products/               # ProductList, ProductCard, ProductFilters, AddToCartButton
│   └── ui/                     # Spinner, StatusMessage (shared loading/empty/error UI)
├── hooks/                      # useFetch (loading/error/success + abort), useDebouncedValue
├── lib/auth/                   # Signed session tokens, hardcoded credential check (server-only)
├── services/                   # Typed REST client + product/auth API functions
├── store/                      # Redux store, slices, memoised selectors, typed hooks, provider
├── types/                      # Product, CartItem, AuthState and related interfaces
└── utils/                      # Formatting helpers
```

## How it works

### Authentication

1. `LoginForm` dispatches the `login` async thunk (in `authSlice`). The thunk sends a POST request to `/api/auth/login`.
2. The route handler checks the credentials against the hardcoded account on the server (`lib/auth/credentials.ts`, marked `server-only`), so the password is never included in client code.
3. If they match, it sets an **httpOnly** `session` cookie. The cookie holds the email plus an HMAC-SHA256 signature made with `AUTH_SECRET` using Web Crypto, so the same code runs in the Proxy, route handlers and Server Components. A forged or edited cookie fails the check.
4. **`src/proxy.ts`** checks the cookie on every matched request and redirects as described in Features. In Next.js 16 the `middleware.ts` file convention was renamed to `proxy.ts` and its export to `proxy`; it works the same way (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).
5. The root layout reads the same cookie on the server and preloads `auth.user` into the Redux store. The header therefore shows the right state on the first render, without flicker.

### Redux state

```ts
interface RootState {
  auth: AuthState; // { user: AuthUser | null; status: "idle" | "loading" | "failed"; error: string | null }
  cart: CartState; // { items: CartItem[] }
}
```

- `cartSlice` has these actions: `addToCart`, `increaseQuantity`, `decreaseQuantity`, `removeFromCart`, `clearCart` and `hydrateCart`.
- **The slice does not store totals.** `selectCartTotalQuantity` and `selectCartTotalAmount` are `createSelector` selectors that calculate the totals from `items`, so the totals always match the items.
- `makeStore()` creates a new store for each request instead of sharing one module-level store. This follows the Redux guidance for the App Router. `StoreProvider` creates the store once per client.
- The cart is loaded from `localStorage` after the page mounts. Loading it during render would make the server and client HTML differ. Changes are saved through a store subscription.
- `useAppDispatch` and `useAppSelector` are typed versions of the React Redux hooks.

### Data fetching

- `services/api.ts` is a small typed `fetch` wrapper. It throws `ApiError` with the HTTP status and the API's error message.
- **Listing**: a Client Component. The search text is debounced and sent to DummyJSON's `/products/search`. Category filtering and sorting run on the results in the browser. `useFetch` returns a loading, success or error state, aborts stale requests and provides `retry`.
- **Details**: a Server Component that fetches the product on the server. React `cache` stops `generateMetadata` and the page from fetching it twice. A non-numeric id or an API 404 shows `not-found.tsx`, and other errors are handled by `error.tsx`.
- Images use `next/image`. `next.config.ts` allows only images from `cdn.dummyjson.com/product-images/**`.
