"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Container, ThemeProvider, createTheme } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const theme = createTheme();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <Container
            sx={{
              p: 10,
            }}
          >
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
