export const metadata = {
  title: 'Matière Grise — Les origines terrestres de l\'IA',
  description: 'Une archéologie des infrastructures matérielles de l\'intelligence artificielle',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
