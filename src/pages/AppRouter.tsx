import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Home from './Home';
import App from './App';
import Plan from './Plan';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />}>
        <Route path="/app/:room-id" element={<Plan />} />
      </Route>
    </>
  )
);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
