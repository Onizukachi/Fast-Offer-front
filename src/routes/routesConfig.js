import HomePage from '@containers/HomePage'
import FavoritesPage from '@containers/FavoritesPage'
import InterviewsPage from '@containers/InterviewsPage'

const routesConfig = [
  {
    path: '/',
    element: HomePage,
  },
  {
    path: '/interviews',
    element: InterviewsPage,
  },
  {
    path: '/favorites',
    element: FavoritesPage,
  },
  // {
  //   path: '/people/:id',
  //   element: PersonPage
  // }
]

export default routesConfig