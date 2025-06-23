import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Star, MapPin, Phone, Mail, ArrowRight, Menu, X } from 'lucide-react';
import NavBar from '../HotelNav&Footer/NavBar';

export default function RestaurantLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Truffle Risotto', price: '$28', desc: 'Creamy arborio rice with black truffle shavings' },
    { name: 'Grilled Salmon', price: '$24', desc: 'Atlantic salmon with herb butter and seasonal vegetables' },
    { name: 'Wagyu Steak', price: '$45', desc: 'Premium wagyu beef with rosemary and garlic' },
    { name: 'Lobster Pasta', price: '$32', desc: 'Fresh lobster with linguine in white wine sauce' }
  ];

  const reviews = [
    { name: 'Sarah M.', rating: 5, text: 'Absolutely incredible dining experience! The ambiance and food were perfect.' },
    { name: 'James L.', rating: 5, text: 'Best restaurant in the city. The chef really knows what they\'re doing.' },
    { name: 'Emma K.', rating: 5, text: 'Every dish was a masterpiece. Will definitely be coming back!' }
  ];

  return (
    <div className="min-h-screen  bg-orange-50">
      {/* Floating Navigation */}
    <div className="fixed top-0 left-0 w-full z-50">
  <NavBar />
</div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-100 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-orange-300 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 animate-fade-in">
            Culinary
            <span className="text-orange-400 block">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Where every dish tells a story and every meal becomes a cherished memory
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-orange-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2">
              View Our Menu <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-orange-400 text-orange-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-400 hover:text-white transition-all duration-300 transform hover:scale-105">
              Book a Table
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section id="menu" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Signature <span className="text-orange-400">Dishes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Crafted with passion, served with perfection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl mb-4 flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-100 transition-all duration-300">
                  <ChefHat className="h-16 w-16 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-400">{item.price}</span>
                  <button className="bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-500 transition-colors">
                    Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-orange-400">Story</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                For over two decades, Saveur has been redefining fine dining with our commitment to exceptional ingredients, innovative techniques, and unforgettable experiences.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our award-winning chef combines traditional culinary arts with modern gastronomy to create dishes that celebrate both heritage and innovation.
              </p>
              
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">20+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">15</div>
                  <div className="text-gray-600">Awards Won</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">50K+</div>
                  <div className="text-gray-600">Happy Guests</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <ChefHat className="h-32 w-32 text-orange-400" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="text-orange-400">Guests</span> Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-orange-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                <div className="font-semibold text-gray-900">— {review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Visit <span className="text-orange-400">Us</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">123 Gourmet Street<br />Culinary District, CD 12345</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Thu: 5:00 PM - 10:00 PM<br />Fri-Sat: 5:00 PM - 11:00 PM<br />Sun: 4:00 PM - 9:00 PM</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-600">(555) 123-4567<br />reservations@saveur.com</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-orange-400 text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-orange-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              Make Reservation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-8 w-8 text-orange-400" />
              <span className="text-2xl font-bold">Saveur</span>
            </div>
            <div className="text-gray-400">
              © 2025 Saveur Restaurant. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}