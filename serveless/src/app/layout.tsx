import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exemplo de Arquitetura Serveless',
  description: 'Exemplo de Arquitetura Serveless',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
