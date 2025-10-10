

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">FlyClim</h3>
            <p className="text-gray-400">
              Complete aviation solutions: AI-powered flight optimization & digital eAIP system
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#solutions" className="text-gray-400 hover:text-white">Solutions</a></li>
              <li><a href="#pilot-program" className="text-gray-400 hover:text-white">Pilot Program</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li><a href="/solutions" className="text-gray-400 hover:text-white">Flight Optimization</a></li>
              <li><a href="https://eaip.flyclim.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">eAIP System</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@flyclim.com</li>
              <li>Tel: +1 (989) 447-2494</li>
              <li className="pt-2"><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} FlyClim. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}