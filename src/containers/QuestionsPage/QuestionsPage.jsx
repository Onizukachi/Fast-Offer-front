import styles from "./QuestionsPage.module.css";
import { useQuery } from "react-query";
import { fetchQuestions } from "./queries";
import {Spinner} from "@nextui-org/react";
import moment from 'moment/min/moment-with-locales';

const QuestionsPage = () => {
  const { data, isSuccess, isLoading } = useQuery(
    `questions`,
    () => fetchQuestions().then((data) => data),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  return (
    <div className="flex flex-col gap-4">
      { isLoading && <Spinner size="lg" color="primary" /> }
      { isSuccess &&
        data["data"].map((el) => {
          return (
            <div
              key={el.id}
              className="px-8 py-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <span className="text-default-500">{moment(el.created_at).format('LL')}</span>
                <a
                  className="px-2 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500"
                  href="#"
                >
                  Design
                </a>
              </div>
              <div className="mt-2">
                <a
                  className="font-bold text-large hover:opacity-80"
                  href="#"
                >
                  {el.body}
                </a>
              </div>
              <div className="flex justify-between items-center mt-4">
                <a className="text-blue-600 hover:underline" href="#">
                  Read more
                </a>
                <div>
                  <a className="flex items-center" href="#">
                    <img
                      className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
                      src="https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=373&q=80"
                      alt="avatar"
                    />
                    <h1 className="text-medium font-bold">Khatab wedaa</h1>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default QuestionsPage;
