import { useQuery } from "react-query";
import { fetchQuestions } from "./queries";
import { Spinner } from "@nextui-org/react";
import Question from "@components/Questions/Question";

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
        data["questions"].map((question) => {
          return <Question key={question.id} question={question} />;
        })}
    </div>
  );
};

export default QuestionsPage;
