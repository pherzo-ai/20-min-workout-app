import './globals.css';

export const metadata = {
  title: '20-Minute Workout',
  description: 'Circuit training app with customizable workout plans',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
