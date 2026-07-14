import Image from "next/image";
import aiLoaderImage from "@/public/images/ai_scanner_loader.gif";
type AIScanningLoaderProps = {
  label?: string;
  className?: string;
};

export default function AIScanningLoader({
  label = "AI scanning in progress...",
  className = "",
}: AIScanningLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between rounded-2xl border-b border-gray-200 sticky top-0 bg-white z-10">
        {/* <div
            className={`w-full flex items-center justify-center ${className}`}
          >
            <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-700">{label}</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse [animation-delay:240ms]" />
                </div>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full bg-blue-50">
                <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-[scan_1.2s_ease-in-out_infinite]" />
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Analyzing patterns and generating insights...
              </div>

              <style jsx>{`
                @keyframes scan {
                  0% {
                    transform: translateX(-120%);
                  }
                  100% {
                    transform: translateX(320%);
                  }
                }
              `}</style>
            </div>
          </div> */}
        <div className="p-2">
          <Image src={aiLoaderImage} alt="Scanning..." height={250} />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
