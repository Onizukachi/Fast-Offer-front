import { useQuery } from "react-query";
import { useState, useCallback, useMemo, useRef } from "react";
import { questionsQuery } from "./queries";
import Question from "@components/Question";
import { deserialize } from "deserialize-json-api";
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";
import {Input, Select, SelectItem, Switch} from "@nextui-org/react";
import { IoSearchOutline } from "react-icons/io5";
import { debounce } from "lodash";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {showToast} from "@utils/toast";
import {UNPERMITTED} from "@constants/toastMessages";
import {positionsQuery} from "@queries/positionsQuery";
import {gradesQuery} from "@queries/gradesQuery";

const LIMIT_PER_PAGE = 10;

const ORDER_OPTIONS = [{key: 'desc', label: 'По возрастанию'}, {key: 'asc', label: 'По убыванию'}]

const QuestionsPage = () => {
  const navigate = useNavigate();
  const [questionsData, setQuestionsData] = useState([]);
  const [positions, setPositions] = useState([])
  const [grades, setGrades] = useState([]);
  const searchTermRef = useRef("");
  const hasMoreRef = useRef(false);
  const cursorRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilters = () => setShowFilters(!showFilters)

  const cleanRefetch = () => {
    setQuestionsData([]);
    cursorRef.current = null;
    refetch();
  }

  const handleSearch = useCallback(() => { cleanRefetch() }, []);

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
      questionsQuery(
        cursorRef.current,
        LIMIT_PER_PAGE,
        searchTermRef.current,
      ).then((data) => {
        hasMoreRef.current = data.meta.has_next;
        cursorRef.current = data.meta.next_cursor;
        setQuestionsData((prevState) =>
          prevState.concat(deserialize(data).data),
        );
      }).catch((error) => {
        console.log(error.response.data)
        if(error.response.status === 401) showToast(UNPERMITTED, 'warning')
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  useQuery(
    `positions`,
    () =>
      positionsQuery().then((data) => {
        setPositions(deserialize(data).data);
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  useQuery(
    `grades`,
    () =>
      gradesQuery().then((data) => {
        setGrades(deserialize(data).data);
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center flex-wrap gap-6">
        <Switch onChange={toggleFilters}>
          Фильтры
        </Switch>
        <div className="max-w-2xl w-full">
          <Input
            type="search"
            size="lg"
            onValueChange={handleSearchInputChange}
            placeholder="Поиск по вопросам"
            startContent={
              <IoSearchOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
            }
          />
        </div>
        <Button
          onClick={() => navigate("/questions/new", {replace: false})}
          color="primary"
          size="lg"
          variant="shadow"
        >
          Задать вопрос
        </Button>
      </div>
      { showFilters && (
        <div className="flex flex-wrap gap-6 justify-center mt-3">
          <Select
            label="Уровень сложности"
            // defaultSelectedKeys={[selectedGradeId?.toString()]}
            labelPlacement="outside"
            placeholder="Выберите уровень"
            className="max-w-56"
            disableSelectorIconRotation
            onChange={(e) => console.log(e.target.value)}
          >
            {grades.map((grade) => (
              <SelectItem key={grade.id}>{grade.grade}</SelectItem>
            ))}
          </Select>
          <Select
            label="Языки программирования"
            // defaultSelectedKeys={selectedPositionIds}
            labelPlacement="outside"
            selectionMode="multiple"
            placeholder="Выберите языки"
            className="max-w-56"
            onChange={(e) =>
              console.log((new Set(e.target.value.split(","))))
            }
          >
            {positions.map((position) => (
              <SelectItem
                key={position.id}
                startContent={
                  <img
                    className="w-6 h-6"
                    src={position.image_url}
                    alt={position.title}
                  ></img>
                }
              >
                {position.title}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Сортировать по дате"
            // defaultSelectedKeys={[selectedGradeId?.toString()]}
            labelPlacement="outside"
            placeholder="Направление"
            className="max-w-44"
            disableSelectorIconRotation
            onChange={(e) => console.log(e.target.value)}
          >
            {ORDER_OPTIONS.map((option) => (
              <SelectItem key={option.id}>{option.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="Сортировать по популярности"
            // defaultSelectedKeys={[selectedGradeId?.toString()]}
            labelPlacement="outside"
            placeholder="Направление"
            className="max-w-56"
            disableSelectorIconRotation
            onChange={(e) => console.log(e.target.value)}
          >
            {ORDER_OPTIONS.map((option) => (
              <SelectItem key={option.id}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}
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
          return <Question key={question.id} question={question} refetch={cleanRefetch}/>;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default QuestionsPage;
