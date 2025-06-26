# Shoppie E-Commerce Platform

A modern, full-stack e-commerce application built with **NestJS** (backend) and **Angular 20** (frontend). Shoppie supports authentication, user profiles, product and cart management, admin features, and email notifications.

---

## 🚀 Features

- **User Authentication** (JWT, registration, login)
- **Profile Management** (view/update profile, instant display, email notification on update)
- **Product Catalog** (browse, search, view details)
- **Shopping Cart** (add, update, remove items)
- **Admin Dashboard** (CRUD for products, role-based access)
- **Cloudinary Integration** (product image uploads)
- **Email Notifications**
  - Welcome email on registration
  - Admin notification on new user registration
  - Profile update notification
  - (Ready for order confirmation, password reset, etc.)
- **Modern UI/UX** (responsive, attractive, user-friendly)

---

## 🛠️ Tech Stack

- **Backend:** [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), [PostgreSQL] (or your DB), [Nodemailer](https://nodemailer.com/), [EJS](https://ejs.co/)
- **Frontend:** [Angular 20](https://angular.io/), Standalone Components, Signals, Functional Routing
- **Styling:** Tailwind CSS, custom CSS
- **Cloud Storage:** [Cloudinary](https://cloudinary.com/)

---

## 📦 Project Structure

```
shoppie-backend/
  .idea/
  generated/
  node_modules/
  prisma/
  restclient/
    cart.http
    cloudinary.http
    products.http
    users.http
  shared/
  shopie-backend/
    dist/
    node_modules/
    prisma/
    restclient/
    shared/
    src/
      auth/
      cart/
      cloudinary/
      mail/
        templates/
          admin-new-user.ejs
          profile-updated.ejs
          project-assigned.ejs
          welcome-user.ejs
        mail-module.ts
        mail-service.ts
      prisma/
      product/
      user/
      app.controller.spec.ts
      app.controller.ts
      app.module.ts
      app.service.ts
      main.ts
    test/
    .env
    .gitignore
    .prettierrc
    eslint.config.mjs
    nest-cli.json
    package-lock.json
    package.json
    README.md
    tsconfig.build.json
    tsconfig.json
  shoppie-frontend/
    .angular/
    dist/
    node_modules/
    src/
      app/
        components/
          header/             # Navigation header
          home/               # Landing page
          login/              # Login form
          register/           # Registration form
          product-list/       # Product catalog
          cart/               # Shopping cart
          admin-dashboard/    # Admin product management
        services/
          api.service.ts      # Base API service
          auth.service.ts     # Authentication service
          product.service.ts  # Product API service
          cart.service.ts     # Cart API service
        models/
          user.model.ts       # User interfaces
          product.model.ts    # Product interfaces
          cart.model.ts       # Cart interfaces
        guards/
          auth.guard.ts       # Authentication guard
          admin.guard.ts      # Admin access guard
        interceptors/
          auth.interceptor.ts # JWT token interceptor
        app.routes.ts         # Application routing
        app.config.ts         # Application configuration
        app.ts                # Main app component
      styles.css              # Global styles with Tailwind
      main.ts                 # Application entry point
    angular.json
    package-lock.json
    package.json
    tsconfig.app.json
    tsconfig.json
    tsconfig.spec.json
  .gitignore
  package-lock.json
  package.json
  postcss.config.js
  README.md
```

---

## ⚡ Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/shoppie.git
cd shoppie-backend
```

### 2. **Backend Setup**
- Install dependencies:
  ```bash
  cd shopie-backend
  npm install
  ```
- Set up your `.env` file (see below).
- Run database migrations:
  ```bash
  npx prisma migrate deploy
  ```
- Start the backend:
  ```bash
  npm run start:dev
  ```

### 3. **Frontend Setup**
- In a new terminal:
  ```bash
  cd shoppie-frontend
  npm install
  npm start
  ```
- The app will be available at `http://localhost:4200`.

---

## 🔑 Environment Variables (Backend)
Create a `.env` file in `shopie-backend/` with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/shoppie
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM="Shoppie <no-reply@shoppie.com>"
ADMIN_EMAIL=maxmillianmuiruri@gmail.com
```

---

## ✉️ Email Setup
- Uses Nodemailer + EJS templates for:
  - Welcome email (on registration)
  - Admin notification (on new user registration)
  - Profile update notification
- To use Gmail, create an App Password and use it for `MAIL_PASS`.
- Email templates are in `src/mail/templates/`.

---

## 👤 Profile Logic
- Loads user info instantly from local storage, then refreshes from backend.
- Updates local storage after profile changes.
- Sends an email notification on profile update.

---

## 🛒 Main Features
- **Products:** Browse, search, view details, admin CRUD
- **Cart:** Add, update, remove items
- **Auth:** Register, login, JWT, role-based access
- **Profile:** View/update, instant display, email notification
- **Admin:** Product management, user management (planned)
- **Email:** Welcome, admin notification, profile update (order confirmation ready)

---

## 🤝 Contributing
1. Fork the repo & create your branch.
2. Make your changes (with clear commits).
3. Submit a pull request.
4. For major changes, open an issue first to discuss.

---

## 📧 Contact
For questions, issues, or feature requests, open an issue or email the admin at maxmillianmuiruri@gmail.com.

---

**Happy shopping with Shoppie! 🛒**
