import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

const App = () => (
  <div className="flex min-h-screen flex-col bg-stone-200 px-8">
    <ToastContainer />
    <Header />
    <main className="container mx-auto flex h-full max-w-screen-lg flex-1 flex-col">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default App;
