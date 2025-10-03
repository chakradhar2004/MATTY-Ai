import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ChevronRight,
  Sparkles,
  Layers,
  Code,
  Star,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Design',
      description: 'Generate stunning designs in seconds with our advanced AI technology.',
    },
    {
      icon: Layers,
      title: 'Layered Editing',
      description: 'Full control over every element with our intuitive layer system.',
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Export clean, production-ready code for your projects.',
    },
  ];

  const templates = [
    {
      id: 1,
      name: 'Social Media Post',
      category: 'Marketing',
      thumbnail: '/images/templates/social-media.jpg',
    },
    {
      id: 2,
      name: 'Business Card',
      category: 'Branding',
      thumbnail: '/images/templates/business-card.jpg',
    },
    {
      id: 3,
      name: 'Presentation',
      category: 'Business',
      thumbnail: '/images/templates/presentation.jpg',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Designs Created' },
    { value: '5K+', label: 'Templates' },
    { value: '24/7', label: 'Support' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Creative Director',
      company: 'Design Studio',
      content: 'Matty AI has transformed how we create designs. The AI suggestions save us hours of work!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content: 'The templates are amazing and the editor is so intuitive. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emma Wilson',
      role: 'Freelance Designer',
      company: 'Self-Employed',
      content: 'As a solo designer, Matty AI gives me the power of a full design team.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-20 bg-transparent">
        <div className="container mx-auto px-4 py-4">
          <div className="w-full rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/images/logo-m.png" alt="Matty Ai" className="w-8 h-8 rounded-md object-contain" />
                <span className="font-semibold text-primary-500 drop-shadow-sm">MATTY Ai</span>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-secondary-700">
                <Link to="/" className="hover:text-foreground">Home</Link>
                <Link to="/templates" className="hover:text-foreground">Templates</Link>
                <Link to="/about" className="hover:text-foreground">About us</Link>
              </nav>
              <div className="flex items-center gap-2">
                <Link to="/register" className="btn btn-sm bg-gradient-to-r from-primary-700 to-primary-400 text-white rounded-full px-4">Sign up</Link>
                <Link to="/login" className="btn btn-sm rounded-full px-4 bg-white text-primary-700 border border-primary-200">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-primary-100 text-white py-24">
        <div className="absolute inset-0 opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Launch pill removed as requested */}
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
              Create Stunning Designs
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white/90 mb-6">with AI-Powered Tools</h2>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto mb-2">
              Design posters, banners, social media graphics, and more with our intuitive drag-and-drop editor.
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10">No design experience required.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50"
              >
                Start Creating
              </Link>
              <Link
                to="/templates"
                className="btn btn-lg border-2 border-white/30 bg-transparent hover:bg-white/10"
              >
                Browse Templates
              </Link>
            </div>
            {/* Preview removed as requested */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Everything you need to create amazing designs</h2>
            <p className="text-base text-secondary-600 max-w-2xl mx-auto">Our comprehensive toolkit gives you the power to bring your creative vision to life.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-card p-8 rounded-2xl border border-border hover:border-primary-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-secondary-600 text-sm leading-6">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Popular Templates</h2>
              <p className="text-secondary-600 mt-2">Get started quickly with our professionally designed templates</p>
            </div>
            <Link 
              to="/templates" 
              className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium group"
            >
              View all templates 
              <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3] bg-secondary-200">
                  <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-400">
                    {template.name}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full btn btn-md bg-white text-primary-600 hover:bg-secondary-50 transform translate-y-4 group-hover:translate-y-0 transition-all">
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="font-semibold text-foreground text-lg">{template.name}</h3>
                  <p className="text-sm text-secondary-500">{template.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-primary-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-4">
                  <div className="text-4xl font-bold text-primary-700 mb-2">{stat.value}</div>
                  <div className="text-primary-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-primary-200/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">Loved by designers worldwide</h2>
            <p className="text-base text-primary-800/90 max-w-2xl mx-auto">See what our users are saying about Matty AI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-secondary-700 italic mb-6 text-center">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-secondary-500">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-800/60"></span>
            <span className="w-2 h-2 rounded-full bg-primary-800/30"></span>
            <span className="w-2 h-2 rounded-full bg-primary-800/30"></span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-100 text-primary-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start creating?</h2>
            <p className="text-base text-primary-800/90 mb-8">Join thousands of designers who are already using Matty AI to create amazing designs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn btn-lg bg-primary-700 text-white hover:bg-primary-800 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/templates"
                className="btn btn-lg border border-primary-300 text-primary-800 bg-transparent hover:bg-primary-50"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-100">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex items-center gap-3">
              <img src="/images/logo-m.png" alt="Matty Ai" className="w-10 h-10 rounded-md object-contain" />
              <span className="text-lg font-semibold">MATTY Ai</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h5 className="font-semibold mb-3 text-primary-50">Product</h5>
                <ul className="space-y-2 opacity-90">
                  <li><Link to="#" className="hover:opacity-100">Features</Link></li>
                  <li><Link to="/templates" className="hover:opacity-100">Templates</Link></li>
                  <li><Link to="#" className="hover:opacity-100">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-3 text-primary-50">Company</h5>
                <ul className="space-y-2 opacity-90">
                  <li><Link to="/about" className="hover:opacity-100">About</Link></li>
                  <li><Link to="#" className="hover:opacity-100">Blog</Link></li>
                  <li><Link to="#" className="hover:opacity-100">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-3 text-primary-50">Support</h5>
                <ul className="space-y-2 opacity-90">
                  <li><Link to="#" className="hover:opacity-100">Help Center</Link></li>
                  <li><Link to="#" className="hover:opacity-100">Contact</Link></li>
                  <li><Link to="#" className="hover:opacity-100">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-3 text-primary-50">Resources</h5>
                <ul className="space-y-2 opacity-90">
                  <li><Link to="#" className="hover:opacity-100">Docs</Link></li>
                  <li><Link to="#" className="hover:opacity-100">Guides</Link></li>
                  <li><Link to="#" className="hover:opacity-100">Community</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-primary-700/60 pt-6 text-center text-sm text-primary-200">
            © 2025 MATTY Ai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;