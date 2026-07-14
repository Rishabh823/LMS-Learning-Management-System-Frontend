"use client";

import { ArrowLeft, CircleAlert } from "lucide-react";
import React from "react";
import Link from "next/link";

interface NotFoundProps {
  message?: string;
  redirectText?: string;
  redirectHref?: string;
  className?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  message = "Oops! The requested resource was not found.",
  redirectText = "Go Back",
  redirectHref = "/",
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xs p-5 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          {/* Static Lucide Icon */}
          <CircleAlert className="text-red-500 h-10 w-10 sm:h-12 sm:w-12" />

          {/* Message */}
          <p className="text-sm sm:text-base font-medium text-gray-700">
            {message}
          </p>

          {/* Back Action */}
          <Link
            href={redirectHref}
            className="mt-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition"
          >
            <ArrowLeft size={14} /> {redirectText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
