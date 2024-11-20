import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const NoMatch = () => (
  <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-stone-400">
    <Header />
    <main className="container mx-auto flex h-full flex-1 flex-col justify-center text-center">
      <div className="top-1/2 -translate-y-1/2 ">
        <h1 className="mt-5 text-6xl font-bold text-stone-800">Oops!</h1>
        <h2 className="mb-4 mt-2 text-2xl leading-7 text-stone-500">
          Seems we didn't account for this
          <br /> in our sprint capacity
        </h2>
        <Link
          className="text-sm text-stone-700 underline hover:text-stone-400"
          to="/"
        >
          Let's get back to planning →
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NoMatch;
