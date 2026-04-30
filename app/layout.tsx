import type { Metadata, Viewport } from "next";                                                                                                                                         
  import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
                                                                                                                                                                                          
  import "./globals.css";
                                                                                                                                                                                          
  const display = Fraunces({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["300", "400", "500"],
    style: ["normal", "italic"],                                                                                                                                                          
  });
                                                                                                                                                                                          
  const sans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
  });                                                                                                                                                                                     
   
  const mono = JetBrains_Mono({                                                                                                                                                           
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500", "700"],
  });                                                                                                                                                                                     
   
  export const metadata: Metadata = {                                                                                                                                                     
    title: "Vishwa Shree Enterprises",
    description: "Bill management workspace for Vishwa Shree Enterprises",
    icons: {
      icon: "/app_icon.svg",                                                                                                                                                              
      shortcut: "/app_icon.svg",
      apple: "/app_icon.svg",                                                                                                                                                             
    },            
  };

  export const viewport: Viewport = {                                                                                                                                                     
    width: "device-width",
    initialScale: 1,                                                                                                                                                                      
    viewportFit: "cover",
    interactiveWidget: "resizes-content",
  };

  export default function RootLayout({                                                                                                                                                    
    children,
  }: {                                                                                                                                                                                    
    children: React.ReactNode;
  }) {
    return (
      <html
        lang="en"
        className={`${display.variable} ${sans.variable} ${mono.variable}`}
      >                                                                                                                                                                                   
        <body style={{ fontFamily: "var(--font-sans)" }}>{children}</body>
      </html>                                                                                                                                                                             
    );            
  }