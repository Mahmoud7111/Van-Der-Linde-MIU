import { createBrowserRouter } from 'react-router-dom';

const routesPlaceholderElement = <div>Routes - coming soon</div>;

export const router = createBrowserRouter([ 
  {
    path: '*',
    element: routesPlaceholderElement,
  },
]);

export default router;
