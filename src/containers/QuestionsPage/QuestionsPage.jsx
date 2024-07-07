import styles from "./QuestionsPage.module.css";
import { useQuery } from "react-query";
import { fetchQuestions } from "./queries";
import { Spinner } from "@nextui-org/react";
import moment from "moment/min/moment-with-locales";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FcLike } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import { GRAVATAR_BASE_URL } from "@constants/gravatar";

const QuestionsPage = () => {
  const { data, isSuccess, isLoading } = useQuery(
    `questions`,
    () => fetchQuestions().then((data) => data),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Spinner size="lg" color="primary" />}
      {isSuccess &&
        data["questions"].map((el) => {
          return (
            <div key={el.id} className="px-8 py-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-default-500">
                  {moment(el.created_at).format("LL")}
                </span>
                <div className="flex gap-3"></div>
              </div>
              <div className="mt-2">
                <a className="font-bold text-large hover:opacity-80" href="#">
                  {el.body}
                </a>
              </div>
              <div className="flex justify-between gap-4 sm:gap-0 items-start sm:items-center mt-4 flex-col sm:flex-row">
                <div className="flex gap-5">
                  <div className="flex">
                    <BiSolidCommentDetail size="1.4em" />
                    <p className="ml-2">{el.answers_count}</p>
                  </div>
                  <div className="flex">
                    <FaEye size="1.4em" />
                    <p className="ml-2">{el.views_count}</p>
                  </div>
                  <div className="flex">
                    <FcLike size="1.4em" />
                    <p className="ml-2">{el.likes_count}</p>
                  </div>
                </div>
                <div>
                  <a className="flex items-center" href="#">
                    <img
                      className="ml-0 mr-4 sm:mx-4 w-10 h-10 object-cover rounded-full sm:block"
                      src={`${GRAVATAR_BASE_URL}/${el.author.gravatar_hash}`}
                      alt="avatar"
                    />
                    <h1 className="text-medium font-bold">{el.author.username}</h1>
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
