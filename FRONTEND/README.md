spring #1: Auth/QR/form

Task#1:Auth(Ali)

- Create AuthContext and AuthProvider for global auth state
- Implement login, logout, and signup functions
- Add localStorage persistence for token and user data
- Auto-login after successful signup
- Add useAuth hook for consuming auth context"

Task#2:backend connection(Ali)

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

Task#3: QR code(Ali)

- AuthProvider
  - Added qrURL state to store QR code URL
  - Updated login and signup functions to accept and store QR code URL
  - Persisted QR code URL in localStorage
- useAuth Hook
  - Updated return type to include qrURL from auth context
- Login Component
  - Updated login function to handle qrURL returned from backend
- QRCodePage Component
  - Created new component to display QR code using react-qr-code library
  - Retrieves qrURL from auth context and renders QR code and URL text

Task#4(Jessica)

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
  - Updated App.tsx with routes for Home (/), Account (/account), and QR Code (/my-qr) pages
  - Integrated React Router Link components in Footer for client-side navigation
- Component Development
  - Created basic Account page component with placeholder content

Task#5(Jessica)

- Styling Improvements
  - Converted QRCodePage from inline styles to Tailwind CSS classes
  - Added global heading styles (h1-h4) in PageLayout.css for consistent typography
- Navigation Enhancements
  - Made navbar logo clickable and redirect to home page using React Router Link
  - Added "My QR Code" link to navbar (visible only when logged in)
  - Added "Account" link to navbar (visible only when logged in)
  - Both links use conditional rendering based on user authentication state
- HomePage Updates
  - Added paramedics.jpg image to HomePage
  - Implemented proper image path and Tailwind styling
  - Created informative paragraph explaining service workflow (sign up, enter medical info, get QR code for emergency responders)
  - Arranged image and text side-by-side using flexbox layout for better visual presentation

Task#6(Jessica)

- Account Page Refactoring
  - Reorganized all forms into new Forms/ directory
  - created skeleton exports for forms to begin structuring Account page
  - Added form components to Account.tsx.
  
##################################################################################################################################
