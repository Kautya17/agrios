import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "AgriOS",
  description: "Land discovery, verification, and investor matching for Indian farmland.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="flex justify-end items-center gap-4 p-4 border-b">
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}