import HomePage from '@containers/HomePage'
import FavoritesPage from '@containers/FavoritesPage'
import InterviewsPage from '@containers/InterviewsPage'
import QuestionsPage from "@containers/QuestionsPage/index.js";

const routesConfig = [
  {
    path: '/',
    element: HomePage,
  },
  {
    path: '/questions',
    element: QuestionsPage,
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