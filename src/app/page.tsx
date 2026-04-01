/**
 * Home page at the root of the app.
 * @returns html page
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-off-white">
      <main className="container-custom py-20">
        
        <div className="flex flex-col gap-8">
          
          <h1 className="font-heading text-6xl font-extrabold tracking-tight text-deep-forest">
            Village <span className="text-lime">Platform</span>
          </h1>

          <p className="font-serif text-2xl italic text-ink-2">
            {"\"A digital space for community and growth.\""}
          </p>

          <hr className="border-cream-dark" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-brand bg-white p-6 shadow-sm border border-cream-dark">
              <h2 className="font-heading text-xl font-bold text-forest-mid mb-2">Our Mission</h2>
              <p className="text-ink-3 text-sm leading-relaxed">
                Utilizing the <strong>Sora</strong> body font for maximum readability across all devices.
              </p>
            </div>

            <div className="rounded-brand bg-sun-light p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-clay mb-2">The Sun Utility</h2>
              <p className="text-ink text-sm">
                This card uses the <code>bg-sun-light</code> and <code>text-clay</code> tokens.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <button className="rounded-brand bg-click-green px-8 py-3 font-heading font-bold text-white transition-transform hover:scale-105 active:bg-forest-dark">
                Get Started
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
