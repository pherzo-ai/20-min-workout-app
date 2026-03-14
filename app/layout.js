import './globals.css';

export const metadata = {
  title: '20-Minute Workout',
  description: 'Circuit training app with customizable workout plans',
  icons: {
    icon: '/start/favicon.png',
    apple: '/start/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Workout',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
