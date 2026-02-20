# Micro Marketplace Submission Checklist

Use this checklist before final submission.

## 1) Project Structure
- [ ] `backend/` exists and runs
- [ ] `web/` exists and runs
- [ ] `mobile/` exists and runs
- [ ] Root `README.md` is complete

## 2) Backend Requirements (Node + Express + MongoDB)
- [ ] MongoDB (Mongoose) connection via `.env`
- [ ] JWT auth middleware implemented
- [ ] Password hashing with `bcryptjs`
- [ ] Validation implemented (`express-validator`)
- [ ] Error handling middleware with proper status codes
- [ ] `POST /auth/register`
- [ ] `POST /auth/login`
- [ ] CRUD for `/products`
- [ ] Search + pagination in `GET /products`
- [ ] Add/Remove favorite endpoints
- [ ] `GET /products/favorites` endpoint
- [ ] Seed script creates 10 products + 2 users

## 3) Web Requirements (React + Vite + Tailwind + Axios)
- [ ] Login/Register pages
- [ ] JWT storage + protected routes
- [ ] Product listing page
- [ ] Product detail page
- [ ] Favorite/Unfavorite from UI
- [ ] Search available from navbar (global)
- [ ] Pagination UI implemented
- [ ] Loading and error states handled
- [ ] Responsive clean modern UI

## 4) Creative UI / UX Elements
- [ ] Animated favorite heart (pop interaction)
- [ ] Skeleton shimmer loading cards
- [ ] Product card hover lift effect
- [ ] Distinct pagination visual design

## 5) Mobile Requirements (React Native / Expo)
- [ ] Login screen
- [ ] Browse products
- [ ] Product detail screen
- [ ] Favorite/Unfavorite support
- [ ] Navigation wired
- [ ] AsyncStorage token persistence
- [ ] API integration working

## 6) README Requirements
- [ ] Setup steps for backend/web/mobile
- [ ] Environment variables documented
- [ ] API documentation listed
- [ ] Seed instructions included
- [ ] Test credentials included
- [ ] Demo script (3–5 min) included
- [ ] Deployment suggestions (Render/Vercel/Expo) included

## 7) Final Run Commands

### Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

### Web
```bash
cd web
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm run start
```

## 8) Demo Credentials
- `buyer@example.com` / `password123`
- `seller@example.com` / `password123`

## 9) Final Pre-Submit Checks
- [ ] Web app opens and login works
- [ ] Favorite add/remove works in web and mobile
- [ ] Search + pagination confirmed in web
- [ ] No obvious console errors
- [ ] Demo video/deployed links ready
- [ ] GitHub repo pushed with all folders
