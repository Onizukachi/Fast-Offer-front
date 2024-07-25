import { useQuery } from "react-query";
import { useState, useCallback, useMemo, useRef } from "react";
import { fetchQuestions } from "./queries";
import Question from "@components/Questions/Question";
import { deserialize } from "deserialize-json-api";
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";
import { Input } from "@nextui-org/react";
import { IoSearchOutline } from "react-icons/io5";
import { debounce } from "lodash";

const LIMIT_PER_PAGE = 10;

const QuestionsPage = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const searchTermRef = useRef("");
  const hasMoreRef = useRef(false);
  const cursorRef = useRef(null);

  const resetPageAndData = () => {
    setQuestionsData([]);
    cursorRef.current = null;
  };

  const handleSearch = useCallback(() => {
    resetPageAndData();
    refetch();
  }, []);

  const debouncedSearch = useMemo(() => {
    return debounce(handleSearch, 500);
  }, [handleSearch]);

  const handleSearchInputChange = (value) => {
    searchTermRef.current = value;
    debouncedSearch();
  };

  const { isLoading, refetch } = useQuery(
    `questions`,
    () =>
      fetchQuestions(
        cursorRef.current,
        LIMIT_PER_PAGE,
        searchTermRef.current,
      ).then((data) => {
        hasMoreRef.current = data.meta.has_next;
        cursorRef.current = data.meta.next_cursor;
        setQuestionsData((prevState) =>
          prevState.concat(deserialize(data).data),
        );
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-2xl w-full mx-auto items-center justify-center">
        <Input
          type="search"
          size="lg"
          onValueChange={handleSearchInputChange}
          placeholder="Поиск по вопросам"
          startContent={
            <IoSearchOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
      </div>

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
        hasMore={hasMoreRef.current}
        loader={
          <BeatLoader
            className="mt-8 text-center"
            size="20px"
            color="#5c7de0"
          />
        }
      >
        {questionsData.map((question) => {
          return <Question key={question.id} question={question} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default QuestionsPage;
