import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const App = () => (
  <div className="flex flex-col min-h-screen bg-stone-200">
    <Header />
    <main className="container mx-auto max-w-screen-lg flex flex-col h-full flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default App;
