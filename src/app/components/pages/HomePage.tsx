import { Link } from 'react-router-dom';
import Header from '../shared/Header';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, MessageCircle, Shield, Star, Users, Video, Calendar, TrendingUp, BookOpen, Brain } from 'lucide-react';

export default function HomePage() {
  const problems = [
    { icon: MessageCircle, title: 'Communication Issues', description: 'Struggling to express feelings' },
    { icon: Users, title: 'Frequent Arguments', description: 'Constant disagreements' },
    { icon: Shield, title: 'Trust & Infidelity', description: 'Rebuilding broken trust' },
    { icon: Heart, title: 'Intimacy Concerns', description: 'Emotional or physical distance' },
    { icon: Calendar, title: 'Long-Distance', description: 'Managing separation' },
    { icon: BookOpen, title: 'Premarital Counseling', description: 'Preparing for marriage' },
  ];

  const features = [
    {
      icon: Video,
      title: 'Online Sessions',
      description: 'Connect with licensed therapists from anywhere via secure video calls',
    },
    {
      icon: Brain,
      title: 'AI Relationship Coach',
      description: '24/7 support with personalized advice and conversation starters',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your relationship health with detailed analytics and insights',
    },
    {
      icon: Users,
      title: 'Expert Matching',
      description: 'Get paired with the perfect therapist based on your unique needs',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <Badge className="mb-4 bg-rose-100 text-rose-700 hover:bg-rose-100">
              Trusted by 50,000+ couples worldwide
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Reconnect, Communicate,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
                and Grow Together
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional couple's counseling that fits your schedule. Connect with licensed therapists and strengthen your relationship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment">
                <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-lg px-8">
                  Take Free Assessment
                </Button>
              </Link>
              <Link to="/therapists">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Browse Therapists
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16">
              <div>
                <div className="text-3xl font-bold text-rose-500">50,000+</div>
                <div className="text-sm text-gray-600">Couples Helped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-500">500+</div>
                <div className="text-sm text-gray-600">Licensed Therapists</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-rose-500">
                  4.9 <Star className="h-6 w-6 fill-rose-500" />
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-500">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Problems Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Problems We Help With
            </h2>
            <p className="text-lg text-gray-600">
              Whatever challenges you're facing, we're here to support your journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-100 p-3 rounded-lg">
                      <problem.icon className="h-6 w-6 text-rose-500" />
                    </div>
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{problem.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-rose-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How TherapyMantra Couples Works
            </h2>
            <p className="text-lg text-gray-600">
              A complete platform designed for your relationship success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-rose-400 to-pink-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Stories, Real Results
            </h2>
            <p className="text-lg text-gray-600">
              Hear from couples who transformed their relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah & Mike',
                story: 'After 3 months of counseling, we finally learned how to communicate without fighting. Our relationship has never been stronger!',
                rating: 5,
              },
              {
                name: 'Priya & Rahul',
                story: 'The AI coach helped us during our long-distance phase. The daily exercises kept us connected across time zones.',
                rating: 5,
              },
              {
                name: 'Emma & James',
                story: 'Premarital counseling was the best investment we made. We entered marriage knowing how to handle conflicts together.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{testimonial.story}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-400 to-pink-500">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Strengthen Your Relationship?
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Take the first step today. Your journey to a healthier relationship starts here.
          </p>
          <Link to="/assessment">
            <Button size="lg" className="bg-white text-rose-500 hover:bg-gray-100 text-lg px-8">
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 fill-white" />
                <span className="font-bold text-lg">TherapyMantra</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional couple's counseling that fits your life.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/therapists" className="hover:text-white">Find Therapists</Link></li>
                <li><Link to="/assessment" className="hover:text-white">Assessment</Link></li>

                <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/resources" className="hover:text-white">Articles</Link></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 TherapyMantra Couples. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
