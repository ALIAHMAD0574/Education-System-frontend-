"use client";
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { BookOpen, Brain, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';


export default function LandingPage() {

  const router = useRouter();
  const isLoggedIn = !!Cookies.get('token'); // Check if the user is logged in

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-400 to-teal-400 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4 max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Welcome to AI-Powered Education
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
                  Revolutionize your learning experience with cutting-edge AI technology. Personalized, adaptive, and efficient education at your fingertips.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  className="w-full sm:w-auto bg-white text-emerald-500 hover:bg-gray-100 px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
                  onClick={() => {
                    if (isLoggedIn) {
                      router.push('/dashboard'); // Redirect to dashboard if logged in
                    } else {
                      router.push('/register'); // Redirect to register if not logged in
                    }
                  }}>
                  Get Started
                </Button>
                <Link href="#features">
                  <Button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-500 px-6 py-3 rounded-lg transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-12 text-gray-800">
              Platform Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-2 p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <BookOpen className="h-12 w-12 text-emerald-500 mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Adaptive Learning</h3>
                <p className="text-gray-600 text-center">
                  AI-driven content that adapts to your learning pace and style.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-2 p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Brain className="h-12 w-12 text-emerald-500 mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Intelligent Tutoring</h3>
                <p className="text-gray-600 text-center">
                  Get personalized assistance from our AI tutors 24/7.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-2 p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Zap className="h-12 w-12 text-emerald-500 mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Progress Tracking</h3>
                <p className="text-gray-600 text-center">
                  Real-time analytics and insights to monitor your learning journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 via-gray-100 to-emerald-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-800">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  Join thousands of students already benefiting from our AI-powered education platform.
                </p>
              </div>
              <div className="w-full max-w-md space-y-4">
                <form className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Input
                    className="flex-1 border-gray-300 px-4 py-2 shadow-lg focus:border-emerald-500 focus:ring-emerald-500 text-black"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-2 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all duration-300"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </form>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 text-emerald-600 hover:text-teal-500 transition-colors duration-300" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}