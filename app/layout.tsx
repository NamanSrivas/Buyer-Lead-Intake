import './globals.css'

export const metadata = {
  title: 'Buyer Lead Intake',
  description: 'Lead management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
