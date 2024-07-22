import { useQuery } from "react-query";
import { useState } from 'react'
import { fetchQuestions } from "./queries";
import { Spinner } from "@nextui-org/react";
import Question from "@components/Questions/Question";
import { deserialize } from "deserialize-json-api";

const QuestionsPage = () => {
  const [questionsData, setQuestionsData] = useState([])
  const { isSuccess, isLoading } = useQuery(
    `questions`,
    () => fetchQuestions().then((data) => {
      console.log(deserialize(data).data)
      setQuestionsData(deserialize(data).data)
    }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Spinner size="lg" color="primary" />}
      {isSuccess &&
        questionsData.map((question) => {
          return <Question key={question.id} question={question} />;
        })}
    </div>
  );
};

export default QuestionsPage;
