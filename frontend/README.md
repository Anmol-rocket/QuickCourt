# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# QuickCourt Frontend 🏆

A modern, responsive web application for sports court booking and tournament management built with React and Vite.

## 🎯 About

QuickCourt is a comprehensive sports facility booking platform that enables users to discover, book, and manage sports courts while providing facility owners and administrators with powerful management tools. The application features a clean, intuitive interface with real-time booking capabilities and integrated payment processing.

## ✨ Features

### 🏠 **Landing Page**
- Hero section with call-to-action
- Feature highlights and testimonials
- Responsive design with modern UI/UX

### 👥 **User Management**
- **User Registration & Login**: Secure authentication system
- **User Dashboard**: Personalized dashboard with booking history
- **Profile Management**: Update personal information and preferences
- **Court Booking**: Interactive booking system with date/time selection
- **Venues Discovery**: Browse and filter available sports venues
- **Venue Details**: Detailed venue information with photo galleries
- **Tournament Participation**: Join and manage tournament entries
- **Review System**: Rate and review venues with star ratings

### 🏢 **Facility Owner Features**
- **Facility Dashboard**: Manage multiple sports facilities
- **Venue Management**: Add, edit, and manage venue details
- **Booking Oversight**: View and manage bookings
- **Revenue Analytics**: Track earnings and performance metrics

### 👨‍💼 **Admin Panel**
- **Admin Dashboard**: Comprehensive system overview
- **User Management**: Manage user accounts and permissions
- **Facility Approval**: Review and approve new facility registrations
- **System Analytics**: Monitor platform usage and performance

### 💳 **Payment Integration**
- **Stripe Integration**: Secure payment processing
- **Payment Modal**: Seamless checkout experience
- **Receipt Generation**: Digital receipts for completed bookings
- **QR Code Support**: QR codes for booking confirmations

### 🌟 **Additional Features**
- **Real-time Ratings**: Dynamic venue rating system via API
- **Location Services**: Geolocation and mapping capabilities
- **Responsive Design**: Mobile-first approach with perfect tablet/desktop support
- **Review System**: Horizontal scrolling review sections
- **Sticky Image Gallery**: Enhanced UX with sticky photo galleries
- **Loading States**: Beautiful loading animations and error handling
- **Avatar System**: Dynamic user avatars with initials

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 19.1.1**: Latest React with modern hooks and features
- **React Router DOM 7.8.0**: Client-side routing and navigation
- **Vite 7.1.0**: Fast build tool and development server

### **Styling & UI**
- **CSS Modules**: Scoped CSS with modular architecture
- **Lucide React**: Beautiful icons and visual elements
- **Responsive Design**: Mobile-first CSS Grid and Flexbox layouts

### **Payment & Communication**
- **Stripe**: Secure payment processing (@stripe/react-stripe-js, @stripe/stripe-js)
- **EmailJS**: Email service integration for notifications
- **QR Code**: QR code generation for bookings

### **Notifications & UX**
- **React Hot Toast**: Beautiful toast notifications
- **Loading States**: Custom spinners and skeleton screens
- **Error Boundaries**: Graceful error handling

### **Development Tools**
- **ESLint**: Code linting and quality assurance
- **Vite Plugin React**: Hot reload and fast refresh
- **TypeScript Support**: Type definitions for React

## 📁 Project Structure

```
src/
├── api/
│   └── baseURL.js              # API configuration
├── assets/
│   └── react.svg               # Static assets
├── components/
│   ├── PaymentModal.jsx        # Stripe payment integration
│   ├── PaymentModal.module.css
│   ├── Receipt.jsx             # Digital receipts
│   └── Receipt.module.css
├── pages/
│   ├── admin/
│   │   ├── AdminLogin.jsx      # Admin authentication
│   │   ├── Dashboard.jsx       # Admin overview
│   │   ├── FacilityApproval.jsx # Facility management
│   │   ├── FacilityDashboard.jsx
│   │   └── UserManagement.jsx  # User administration
│   ├── auth/
│   │   ├── facilityOwnerAuth/
│   │   │   ├── FacilityOwnerLogin.jsx
│   │   │   └── FacilityOwnerRegister.jsx
│   │   └── userAuth/
│   │       ├── UserLogin.jsx
│   │       └── UserRegister.jsx
│   ├── facilityOwner/
│   │   └── FacilityOwnerDashboard.jsx
│   ├── user/
│   │   ├── CourtBooking.jsx    # Interactive booking system
│   │   ├── ProfilePage.jsx     # User profile management
│   │   ├── TournamentsPage.jsx # Tournament features
│   │   ├── UserDashboard.jsx   # User home
│   │   ├── VenueDetails.jsx    # Detailed venue view
│   │   └── VenuesPage.jsx      # Venue discovery
│   └── LandingPage.jsx         # Public homepage
├── utils/
│   ├── avatarUtils.js          # Avatar generation utilities
│   ├── locationService.js      # Geolocation services
│   └── stripe.js               # Payment utilities
├── App.jsx                     # Main application component
├── main.jsx                    # Application entry point
└── index.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (QuickCourt Backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuickCourt/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update `src/api/baseURL.js` with your backend API URL
   - Configure Stripe keys in environment variables

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be generated in the `dist/` directory.

## 🎨 Key Components & Features

### **VenueDetails Component**
- **Sticky Image Gallery**: Photos remain visible while scrolling
- **Dynamic Rating System**: Real-time ratings from API endpoint
- **Horizontal Review Section**: Smooth scrolling review cards
- **Responsive Carousel**: Touch-friendly image navigation
- **Price Removed**: Clean interface without pricing distractions

### **Payment System**
- **Stripe Integration**: Secure card processing
- **Modal Interface**: Non-intrusive checkout flow
- **Receipt Generation**: Instant digital receipts
- **Error Handling**: Graceful payment failure management

### **Booking System**
- **Interactive Calendar**: Date and time selection
- **Real-time Availability**: Live court availability checking
- **Conflict Prevention**: Smart booking conflict resolution
- **Confirmation System**: QR codes and email confirmations

### **Admin Dashboard**
- **Facility Management**: Approve/reject facility applications
- **User Analytics**: Comprehensive user activity tracking
- **Revenue Insights**: Financial performance monitoring
- **System Health**: Platform performance metrics

## 🔧 Configuration

### **API Integration**
The application connects to various API endpoints:
- `GET /api/venues` - Venue listings
- `GET /api/venues/{id}` - Venue details
- `GET /api/comments/getRating/{venueId}` - Real-time ratings
- `POST /api/bookings` - Create bookings
- `GET /api/users/profile` - User profiles

### **Stripe Configuration**
Configure Stripe in `src/utils/stripe.js`:
```javascript
const stripePromise = loadStripe('your-publishable-key-here');
```

### **Email Service**
EmailJS configuration in components for:
- Booking confirmations
- User notifications
- Admin alerts

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Key responsive features:
- Mobile-first CSS architecture
- Touch-friendly interface elements
- Optimized image loading
- Collapsible navigation menus

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Role-based access control
- **Input Validation**: Client-side form validation
- **HTTPS Only**: Secure payment processing
- **XSS Protection**: Sanitized user inputs

## 🧪 Development

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build

### **Code Quality**
- **ESLint**: Enforced coding standards
- **CSS Modules**: Scoped styling to prevent conflicts
- **Component Architecture**: Reusable, modular components
- **Error Boundaries**: Graceful error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Developed By

**Team Infinity_Loop** at **Odoo Hackathon 2025**

### Team Members:
- **Anmol** - Full Stack Developer
- **Adarsh** - Frontend Developer  
- **Ayush** - Backend Developer
- **Sauvir** - UI/UX Designer

---

### 📞 Support

For support, email edura.learningapp@gmail.com


---

**Built with ❤️ during Odoo Hackathon 2025**
