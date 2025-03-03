import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, Target, Brain, Mail, Search, BarChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Lead Research AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-stone-600 hover:text-stone-900">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Intelligent Lead Research & Sales Automation
            </h1>
            <p className="text-xl mb-8 text-stone-300">
              Automate lead research by aggregating and analyzing publicly available data to generate actionable insights for your sales team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/signup" 
                className="bg-white text-stone-900 px-6 py-3 rounded-md font-medium hover:bg-stone-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link 
                href="/demo" 
                className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Sales Teams</h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Our platform combines advanced AI with powerful scraping tools to give you a competitive edge in sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">ICP Builder</h3>
              <p className="text-stone-600 mb-4">
                Create detailed ideal customer profiles with dynamic filters and boolean logic for precise targeting.
              </p>
              <Link href="/features/icp" className="text-blue-600 font-medium flex items-center">
                Learn more <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Lead Generation</h3>
              <p className="text-stone-600 mb-4">
                Automatically discover and enrich leads from LinkedIn, Twitter, and other platforms.
              </p>
              <Link href="/features/leads" className="text-green-600 font-medium flex items-center">
                Learn more <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Search className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Content Aggregation</h3>
              <p className="text-stone-600 mb-4">
                Collect and analyze content from multiple platforms to understand your leads better.
              </p>
              <Link href="/features/content" className="text-purple-600 font-medium flex items-center">
                Learn more <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
              <p className="text-stone-600 mb-4">
                Leverage AI to extract topics, analyze sentiment, and generate personalized insights.
              </p>
              <Link href="/features/ai" className="text-amber-600 font-medium flex items-center">
                Learn more <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Mail className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sales Automation</h3>
              <p className="text-stone-600 mb-4">
                Create personalized email campaigns with AI-generated content based on lead activity.
              </p>
              <Link href="/features/automation" className="text-red-600 font-medium flex items-center">
                Learn more <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart className="text-teal-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
              <p className="text-stone-600 mb-4">
                Track campaign performance and lead engagement with comprehensive analytics.
              </p>
              <Link href="/features/analytics" className="text-teal-600 font-medium flex items-center">
                Learn more <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-stone-600 mb-6">For small sales teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-stone-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 500 leads</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic ICP builder</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>LinkedIn scraping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email finder</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>5 email campaigns</span>
                </li>
              </ul>
              <Link 
                href="/signup?plan=starter" 
                className="block w-full bg-stone-900 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-stone-800 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-white p-8 rounded-lg shadow-sm border-2 border-stone-900 relative">
              <div className="absolute top-0 right-0 bg-stone-900 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-stone-600 mb-6">For growing teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-stone-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 2,000 leads</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced ICP builder</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Multi-platform scraping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI content analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>20 email campaigns</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Team collaboration</span>
                </li>
              </ul>
              <Link 
                href="/signup?plan=professional" 
                className="block w-full bg-stone-900 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-stone-800 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-stone-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$249</span>
                <span className="text-stone-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited leads</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom ICP templates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority data enrichment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced AI insights</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited campaigns</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>CRM integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link 
                href="/signup?plan=enterprise" 
                className="block w-full bg-stone-900 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-stone-800 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Lead Research AI</h3>
              <p className="text-stone-400">
                Intelligent sales automation platform for modern sales teams.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-stone-400 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-stone-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/integrations" className="text-stone-400 hover:text-white">Integrations</Link></li>
                <li><Link href="/roadmap" className="text-stone-400 hover:text-white">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-stone-400 hover:text-white">Blog</Link></li>
                <li><Link href="/docs" className="text-stone-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/guides" className="text-stone-400 hover:text-white">Guides</Link></li>
                <li><Link href="/support" className="text-stone-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-stone-400 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-stone-400 hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="text-stone-400 hover:text-white">Contact</Link></li>
                <li><Link href="/legal" className="text-stone-400 hover:text-white">Legal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-stone-400">© 2024 Lead Research AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-stone-400 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-stone-400 hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
