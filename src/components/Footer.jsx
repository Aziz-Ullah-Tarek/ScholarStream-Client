import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 text-base-content mt-auto border-t border-base-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:scale-105 transition-transform">
              <span className="text-4xl">🎓</span>
              <span>ScholarStream</span>
            </Link>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Empowering students to achieve their dreams through accessible scholarship opportunities. Your journey to success starts here.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="btn btn-circle btn-sm btn-ghost hover:btn-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" 
                 className="btn btn-circle btn-sm btn-ghost hover:btn-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                 className="btn btn-circle btn-sm btn-ghost hover:btn-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="btn btn-circle btn-sm btn-ghost hover:btn-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h6 className="text-lg font-bold text-primary">Quick Links</h6>
            <ul className="space-y-2">
              <li><Link to="/" className="link link-hover text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/scholarships" className="link link-hover text-sm hover:text-primary transition-colors">Browse Scholarships</Link></li>
              <li><Link to="/login" className="link link-hover text-sm hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/register" className="link link-hover text-sm hover:text-primary transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="link link-hover text-sm hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h6 className="text-lg font-bold text-primary">Resources</h6>
            <ul className="space-y-2">
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h6 className="text-lg font-bold text-primary">Contact & Legal</h6>
            <ul className="space-y-2">
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="link link-hover text-sm hover:text-primary transition-colors">Support Center</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-base-300/50 border-t border-base-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-base-content/70">
              © {new Date().getFullYear()} <span className="font-semibold text-primary">ScholarStream</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="link link-hover hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="link link-hover hover:text-primary transition-colors">Terms</a>
              <a href="#" className="link link-hover hover:text-primary transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
