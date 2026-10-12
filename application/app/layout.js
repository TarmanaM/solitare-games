import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

export const metadata = {
  title: 'Klondike Solitaire - Classic Web Card Game',
  description:
    'Play elegant Klondike Solitaire with responsive layout, undo history, and local leaderboards.',
};

// Root layout providing application providers (Theme, TanStack Query, Notistack)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#061a14' }}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
