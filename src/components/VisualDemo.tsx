import { useState } from 'react';
import { X } from 'lucide-react';

const screenshots = [
  {
    src: '/Dashboard.jpg',
    alt: 'ShaadiMausam Weather Dashboard',
    title: 'Comprehensive Weather Dashboard',
  },
  {
    src: '/Timing.png',
    alt: 'Golden Hour Photography Timing',
    title: 'Perfect Photography Timing',
  },
  {
    src: '/Planning.jpg',
    alt: 'Wedding Date Recommendations',
    title: 'Smart Date Planning',
  },
];

export function VisualDemo() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-white to-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            See It In Action
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-maroon-500 mb-4">
            Powerful Weather Intelligence at Your Fingertips
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our intuitive interface designed specifically for wedding planning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-gold-100 hover:border-gold-400 active:border-gold-500 transition-all duration-300 transform hover:-translate-y-2 active:scale-98 hover:shadow-2xl touch-manipulation">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 md:p-6 bg-gradient-to-r from-gold-50 to-cream-50">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 text-center">
                    {screenshot.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-maroon-500 to-maroon-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Experience It Yourself?
          </h3>
          <p className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who are planning their perfect wedding with confidence
          </p>
          <button className="bg-white text-maroon-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cream-50 transition-all transform hover:scale-105 shadow-lg">
            Get Started Free
          </button>
        </div>
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 md:p-8 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-gold-400 active:text-gold-500 transition-colors bg-black/50 rounded-full p-3 md:p-2 touch-manipulation"
            onClick={() => setSelectedImage(null)}
            aria-label="Close preview"
          >
            <X size={32} strokeWidth={2.5} />
          </button>
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={screenshots[selectedImage].src}
              alt={screenshots[selectedImage].alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
