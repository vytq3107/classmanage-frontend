import './globals.css';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export const metadata = {
  title: 'Login',
  description: 'System login page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar
          pauseOnHover
        />
        {children}
      </body>
    </html>
  )
}
