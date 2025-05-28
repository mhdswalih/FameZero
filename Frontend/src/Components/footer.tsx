import React from "react";
import { Typography } from "@material-tailwind/react";
import footer_logo  from "../../img/Screenshot 2025-04-26 144600.png"

interface FooterWithLogoProps {
  // You can add any props here if needed
}

export const FooterWithLogo: React.FC<FooterWithLogoProps> = () => {
  return (
    <footer className="bg-orange-350 text-white">
      {/* Top divider */}
      <div className="flex justify-center">
        <hr className="border-t-2 border-white w-full max-w-8xl mx-auto" />
      </div>
      
      {/* Footer content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and company info */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img
              src={footer_logo}
              alt="Company logo"
              className="w-40 h-12 rounded-sm"
            />
            <Typography variant="h5" className="font-bold italic">
              FameZero
            </Typography>
            <Typography className="text-center md:text-left max-w-md">
              Creating amazing experiences through quality products and services.
            </Typography>
          </div>

          {/* Navigation links */}
          <nav className="grid grid-cols-2 md:flex gap-6 md:gap-10">
            <div className="flex flex-col gap-2">
              <Typography variant="h6" className="font-bold mb-2">
                Company
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                About Us
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Careers
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Blog
              </Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6" className="font-bold mb-2">
                Resources
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Documentation
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Help Center
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Community
              </Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6" className="font-bold mb-2">
                Legal
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Privacy Policy
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Terms of Service
              </Typography>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-orange-200"
              >
                Cookie Policy
              </Typography>
            </div>
          </nav>
        </div>

        {/* Bottom divider and copyright */}
        <hr className="my-8 border-orange-400" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography className="text-sm">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </Typography>
          
          {/* Social media links */}
          <div className="flex gap-4">
            <a href="#" className="text-white hover:text-orange-200 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-orange-200 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-orange-200 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};