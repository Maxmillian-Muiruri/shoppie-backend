# Shopie Frontend

A modern Angular e-commerce frontend application for the Shopie platform.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Product Management**: Browse products, view details, and add to cart
- **Shopping Cart**: Add, update, and remove items from cart
- **Admin Dashboard**: Product management for administrators
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Role-based Access**: Different views for customers and administrators

## Tech Stack

- **Angular 20**: Latest version with standalone components
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling and responsive design
- **RxJS**: For reactive programming
- **Angular Router**: For navigation
- **Angular Forms**: For form handling

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Navigation header
│   │   ├── home/             # Landing page
│   │   ├── login/            # Login form
│   │   ├── register/         # Registration form
│   │   ├── product-list/     # Product catalog
│   │   ├── cart/             # Shopping cart
│   │   └── admin-dashboard/  # Admin product management
│   ├── services/
│   │   ├── api.service.ts    # Base API service
│   │   ├── auth.service.ts   # Authentication service
│   │   ├── product.service.ts # Product API service
│   │   └── cart.service.ts   # Cart API service
│   ├── models/
│   │   ├── user.model.ts     # User interfaces
│   │   ├── product.model.ts  # Product interfaces
│   │   └── cart.model.ts     # Cart interfaces
│   ├── guards/
│   │   ├── auth.guard.ts     # Authentication guard
│   │   └── admin.guard.ts    # Admin access guard
│   ├── interceptors/
│   │   └── auth.interceptor.ts # JWT token interceptor
│   ├── app.routes.ts         # Application routing
│   ├── app.config.ts         # Application configuration
│   └── app.ts               # Main app component
├── styles.css               # Global styles with Tailwind
└── main.ts                 # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shoppie-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### Backend Connection

The frontend is configured to connect to the backend API at `http://localhost:3000`. Make sure your backend server is running before testing the frontend.

## Available Scripts

- `ng serve` - Start development server
- `ng build` - Build the application for production
- `ng test` - Run unit tests
- `ng lint` - Run linting

## API Endpoints

The frontend communicates with the following backend endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin only)
- `PUT /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)

### Cart
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/items/:id` - Update cart item quantity
- `DELETE /cart/items/:id` - Remove item from cart
- `DELETE /cart` - Clear cart

## Authentication

The application uses JWT tokens for authentication. Tokens are automatically:
- Stored in localStorage upon login/registration
- Included in HTTP requests via the auth interceptor
- Removed upon logout

## Role-based Access

- **Customers**: Can browse products, add to cart, and manage their cart
- **Administrators**: Have access to the admin dashboard for product management

## Styling

The application uses Tailwind CSS for styling. The configuration is in `tailwind.config.js` and global styles are in `src/styles.css`.

## Development

### Adding New Components

1. Create a new component using Angular CLI:
```bash
ng generate component components/component-name
```

2. Make sure to import it in the routing configuration if needed.

### Adding New Services

1. Create a new service using Angular CLI:
```bash
ng generate service services/service-name
```

2. Register it in the appropriate module or use `providedIn: 'root'` for global services.

## Deployment

To build the application for production:

```bash
ng build --configuration production
```

The built files will be in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
