import './globals.css';

import ClientProviders from '@/components/ClientProviders';


export const metadata = {
  title: 'Hospital Voice Agent',
  description: 'AI-powered patient follow-up system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body suppressHydrationWarning>
        {/* ✅ All client-side providers are handled inside ClientProviders */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
