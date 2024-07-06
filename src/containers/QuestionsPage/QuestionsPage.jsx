import styles from "./QuestionsPage.module.css";
import { useQuery } from "react-query";
import { fetchQuestions } from "./queries";
import { Spinner } from "@nextui-org/react";
import moment from "moment/min/moment-with-locales";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FcLike } from "react-icons/fc";
import { FaEye } from "react-icons/fa";

const QuestionsPage = () => {
  const { data, isSuccess, isLoading } = useQuery(
    `questions`,
    () => fetchQuestions().then((data) => data),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  console.log(data);

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Spinner size="lg" color="primary" />}
      {isSuccess &&
        data["data"].map((el) => {
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
                    <p className="mr-2">12</p>
                    <BiSolidCommentDetail size="1.4em" />
                  </div>
                  <div className="flex">
                    <p className="mr-2">322</p>
                    <FaEye size="1.4em" />
                  </div>
                  <div className="flex">
                    <p className="mr-2">4</p>
                    <FcLike size="1.4em" />
                  </div>
                </div>
                <div>
                  <a className="flex items-center" href="#">
                    <img
                      className="ml-0 mr-4 sm:mx-4 w-10 h-10 object-cover rounded-full sm:block"
                      src="https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109"
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
