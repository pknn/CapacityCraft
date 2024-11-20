import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Home from './Home';
import App from './App';
import Plan from './Plan';
import NoMatch from './NoMatch';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />}>
        <Route path="/app/:roomId" element={<Plan />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </>
  )
);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
