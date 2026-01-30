 # ChicComet Ecommerce Platform  
एक complete ecommerce platform जो ChicComet hospitality linen products के लिए बनाया गया है। यह platform Next.js 15, React 19, और Tailwind CSS पर बना है।

## 🚀 Features
### 🛍️ Customer Features
- **Product Catalog**: Complete product listing with search, filters, and sorting
- **Product Details**: Detailed product pages with images, reviews, and specifications
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout Process**: Multi-step checkout with shipping and payment
- **User Account**: Profile management, order history, wishlist
- **Order Tracking**: Track orders and view order status
- **Responsive Design**: Mobile-first responsive design

### 👨‍💼 Admin Features
- **Dashboard**: Analytics and overview of store performance
- **Product Management**: Add, edit, delete products
- **Order Management**: View and manage customer orders
- **User Management**: Manage customer accounts
- **Analytics**: Sales reports and performance metrics
- **Settings**: Store configuration and preferences

### 🔐 Authentication
- User registration and login
- Admin access control
- Session management
- Password protection

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Icons**: Lucide React
- **Authentication**: Custom auth system with localStorage
- **API**: Next.js API routes

## 📁 Project Structure

```
ecommerce/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin panel pages
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order management
│   │   ├── users/               # User management
│   │   ├── analytics/           # Analytics dashboard
│   │   └── settings/            # Admin settings
│   ├── api/                     # API routes
│   │   ├── products/            # Product API
│   │   ├── orders/              # Order API
│   │   └── users/               # User API
│   ├── account/                 # User account pages
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout process
│   ├── login/                   # Login page
│   ├── signup/                  # Registration page
│   ├── products/                # Product pages
│   │   └── [id]/               # Product detail pages
│   ├── orders/                  # Order history
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                   # Reusable components
│   ├── ui/                     # shadcn/ui components
│   ├── header.tsx              # Site header
│   ├── footer.tsx              # Site footer
│   ├── hero-section.tsx        # Homepage hero
│   ├── product-categories.tsx  # Product categories
│   ├── best-sellers.tsx        # Best sellers section
│   └── brand-story.tsx         # Brand story section
├── lib/                         # Utility libraries
│   ├── auth-context.tsx        # Authentication context
│   ├── cart-context.tsx        # Shopping cart context
│   └── utils.ts                # Utility functions
├── public/                      # Static assets
│   └── images/                 # Product images
└── styles/                      # Global styles
    └── globals.css             # Global CSS
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Test Accounts

### Admin Account
- **Email**: admin@chiccomet.com
- **Password**: Rahul6375@@@
- **Access**: Full admin panel access

### Customer Account
- Create a new account through the signup page
- Or use any email/password combination

## 🎯 Key Features Explained

### 🛒 Shopping Cart
- Add products to cart from product pages
- Manage quantities in cart
- Persistent cart storage using localStorage
- Real-time cart updates

### 💳 Checkout Process
- Multi-step checkout (Shipping → Payment → Review)
- Form validation
- Order confirmation
- Mock payment processing

### 👨‍💼 Admin Panel
- **Dashboard**: Overview of sales, orders, and users
- **Products**: CRUD operations for products
- **Orders**: View and manage customer orders
- **Users**: Manage customer accounts
- **Analytics**: Sales reports and metrics
- **Settings**: Store configuration

### 🔐 Authentication System
- User registration and login
- Admin role-based access
- Session persistence
- Protected routes

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All screen sizes

## 🎨 UI Components

Built with shadcn/ui components:
- Cards, Buttons, Inputs
- Tables, Forms, Modals
- Navigation, Dropdowns
- Badges, Alerts
- And many more

## 🔧 Customization

### Adding New Products
1. Go to Admin Panel → Products
2. Click "Add Product"
3. Fill in product details
4. Save the product

### Modifying Styles
- Edit `app/globals.css` for global styles
- Use Tailwind CSS classes for component styling
- Customize shadcn/ui components in `components/ui/`

### Adding New Features
- Create new pages in `app/` directory
- Add API routes in `app/api/`
- Create reusable components in `components/`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/[id]` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order

### Users
- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/[id]` - Update user

## 🛡️ Security Features

- Input validation
- XSS protection
- CSRF protection
- Secure authentication
- Role-based access control

## 📈 Performance

- Server-side rendering (SSR)
- Static site generation (SSG)
- Image optimization
- Code splitting
- Lazy loading

## 🔮 Future Enhancements

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Multi-language support
- [ ] PWA features
- [ ] Advanced analytics
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

---

**ChicComet Ecommerce Platform** - Premium hospitality linen products for your comfort! 🛌✨
