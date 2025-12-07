import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../components/ui/Button';

const slides = [
  {
    title: "Track Every Penny",
    description: "Add expenses, categorize spending, and see your financial patterns instantly.",
    icon: "💰"
  },
  {
    title: "Visual Insights",
    description: "Beautiful charts and graphs show exactly where your money goes.",
    icon: "📊"
  },
  {
    title: "Smart Filters",
    description: "Search, filter, and sort your expenses with powerful tools.",
    icon: "🔍"
  },
  {
    title: "Ready to Start?",
    description: "Your financial journey begins now. Let's get tracking!",
    icon: "🚀"
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="relative h-96 rounded-3xl bg-white/60 backdrop-blur-xl shadow-2xl p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-6">{slides[currentSlide].icon}</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xl text-gray-700 max-w-md mx-auto">
                {slides[currentSlide].description}
              </p>
              
              <div className="flex justify-center items-center mt-8 space-x-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-primary-600 scale-125 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={nextSlide}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-xl p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <FiArrowRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              Smart Expense Tracker
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Get started with your financial journey. Track, analyze, and master your spending.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={goToDashboard}
              variant="primary"
              size="lg"
              className="w-full lg:w-auto px-12 py-6 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Now
            </Button>
            
            <div className="text-center lg:text-left pt-4">
              <p className="text-sm text-gray-600">
                Features you'll love:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Real-time charts & analytics</li>
                <li>• Smart search & filters</li>
                <li>• Category tracking</li>
                <li>• Secure & private</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
