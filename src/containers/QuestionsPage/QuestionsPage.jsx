import { useQuery } from "react-query";
import { useState } from "react";
import { fetchQuestions } from "./queries";
import Question from "@components/Questions/Question";
import { deserialize } from "deserialize-json-api";
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";

const LIMIT_PER_PAGE = 10;

const QuestionsPage = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [lastCursor, setLastCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const { isLoading, refetch } = useQuery(
    `questions`,
    () =>
      fetchQuestions(lastCursor, LIMIT_PER_PAGE).then((data) => {
        setHasMore(data.meta.has_next);
        setLastCursor(data.meta.next_cursor);
        setQuestionsData((prevState) =>
          prevState.concat(deserialize(data).data),
        );
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  return (
    <div className="flex flex-col gap-4">
      {isLoading && (
        <div>
          <BeatLoader
            className="mt-8 text-center"
            size="20px"
            color="#5c7de0"
          />
        </div>
      )}
      <InfiniteScroll
        dataLength={questionsData.length}
        next={refetch}
        hasMore={hasMore}
        loader={<BeatLoader className="mt-8 text-center" size="20px" color="#5c7de0" />}
      >
        {questionsData.map((question) => {
          return <Question key={question.id} question={question} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default QuestionsPage;
