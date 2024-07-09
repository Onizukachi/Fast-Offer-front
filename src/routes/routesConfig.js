import HomePage from '@containers/HomePage'
import FavoritesPage from '@containers/FavoritesPage'
import InterviewsPage from '@containers/InterviewsPage'
import QuestionsPage from "@containers/QuestionsPage";
import QuestionPage from "@containers/QuestionPage";

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
    path: '/questions/:id',
    element: QuestionPage,
  },
  {
    path: '/interviews',
    element: InterviewsPage,
  },
  {
    path: '/favorites',
    element: FavoritesPage,
  },
]

export default routesConfig