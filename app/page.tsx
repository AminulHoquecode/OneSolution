import { PhotoIcon, ArrowsPointingInIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import Image from "next/image"
import AdBanner from "./components/AdBanner"

const features = [
  {
    name: "PDF Resizer",
    description: "Compress and resize PDF files while maintaining quality",
    icon: ArrowsPointingInIcon,
    href: "/pdf-resizer",
  },
  {
    name: "Photo to PDF",
    description: "Convert your photos to PDF format in seconds",
    icon: ArrowsRightLeftIcon,
    href: "/photo-to-pdf",
  },
  {
    name: "Photo Resizer",
    description: "Resize and optimize your photos quickly",
    icon: PhotoIcon,
    href: "/photo-resizer",
  }
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-black">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.svg"
            alt="OneSolution Logo"
            width={200}
            height={200}
            priority
            className="animate-fadeIn"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-6">
          OneSolution
        </h1>
        <p className="mt-6 text-xl md:text-2xl font-medium text-white mb-4">
          Your all-in-one solution for PDF and image processing
        </p>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Simple, fast, and efficient tools to handle all your document needs
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className="group flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-8 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
            >
              <div className="mb-4 rounded-lg bg-gray-800 p-3 w-fit group-hover:bg-indigo-900 transition-colors">
                <feature.icon className="h-8 w-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                {feature.name}
              </h2>
              <p className="mt-2 text-gray-300 group-hover:text-gray-200 transition-colors">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Ad Banner at the bottom of the page */}
      <div className="mt-16 w-full max-w-3xl mx-auto">
        <AdBanner 
          slot="homepage_banner" 
          format="horizontal" 
          className="rounded-lg overflow-hidden"
        />
      </div>
    </main>
  )
}
