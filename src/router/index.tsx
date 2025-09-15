// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layout';
import Home from '../pages/Home';
import MyStory from '../pages/MyStory';
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';
import Media from '../pages/Media';
import Contact from '../pages/Contact';
import Investors from '../pages/Investors';
import { LOCALES, PATHS, type Locale } from './paths';

function routesForLocale(l: Locale) {
  const P = PATHS[l];
  return [
    { path: P.home, element: <Home /> },
    { path: P.story, element: <MyStory /> },
    { path: P.blog, element: <Blog /> },
    { path: P.post(':slug'), element: <BlogPost /> },
    { path: P.media, element: <Media /> },
    { path: P.contact, element: <Contact /> },
    { path: P.investors, element: <Investors /> },
  ];
}

const children = (LOCALES as readonly Locale[]).flatMap(routesForLocale);

const router = createBrowserRouter([
  { path: '/', element: <Layout />, children }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
