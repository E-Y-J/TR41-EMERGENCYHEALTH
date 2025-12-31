spring #1: Auth/QR/form

Task#1(Ali)

- Create AuthContext and AuthProvider for global auth state
- Implement login, logout, and signup functions
- Add localStorage persistence for token and user data
- Auto-login after successful signup
- Add useAuth hook for consuming auth context"

Task#2(Ali)

- Login Component
  - Added form state management with controlled inputs for email and password
  - Integrated useAuth hook to access authentication context
  - Implemented API call to /login endpoint at http://127.0.0.1:5000
  - Added error handling for failed login attempts
  - Stores authentication token and user data after successful login
- SignUp Component
  - Added form state management with controlled inputs for fname, lname, email, and password
  - Integrated useAuth hook
  - Calls signup function from auth context with complete user data
- AuthProvider
  - Updated signup function to accept full user data (fname, lname, email, password)
  - Implemented two-step signup process: creates user via /pationts endpoint, then auto-logins via /login endpoint
  - Automatically stores auth token and user data after successful signup
- AuthContext
  - Updated TypeScript interface to include fname and lname fields in signup method signature

Task#3(Jessica)

- Login and Logout Forms
  - Created complete login form with email and password inputs
  - Implemented logout functionality integrated with auth context
  - Added form validation and error handling
- CSS Styling
  - Developed AuthContainer.css for authentication layout
  - Created AuthModal.css for modal components
  - Implemented Header.css for navigation styling
  - Added PageLayout.css with Tailwind integration
- Navigation Components
  - Built responsive Header/Navbar component with navigation links
  - Added Footer component with Quick Links, Contact info, and company details
  - Implemented sticky footer that stays at bottom of page using flexbox layout
- Routing Setup
  - Updated App.tsx with routes for Home (/), Account (/account), and QR Code (/qrcode) pages
  - Integrated React Router Link components in Footer for client-side navigation
  
##################################################################################################################################
