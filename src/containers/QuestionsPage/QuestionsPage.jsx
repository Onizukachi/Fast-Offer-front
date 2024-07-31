import { useQuery } from "react-query";
import { useState, useCallback, useRef, useEffect } from "react";
import { questionsQuery } from "./queries";
import Question from "@components/Question";
import { deserialize } from "deserialize-json-api";
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";
import { Input, Select, SelectItem, Switch } from "@nextui-org/react";
import { IoSearchOutline } from "react-icons/io5";
import { debounce } from "lodash";
import { Button } from "@nextui-org/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "@utils/toast";
import { UNPERMITTED } from "@constants/toastMessages";
import { positionsQuery } from "@queries/positionsQuery";
import { gradesQuery } from "@queries/gradesQuery";

const LIMIT_PER_PAGE = 10;

const ORDER_OPTIONS = [
  { key: "desc", label: "По возрастанию" },
  { key: "asc", label: "По убыванию" },
];

const QuestionsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questionsData, setQuestionsData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedGradeId, setSelectedGradeId] = useState(
    searchParams.get("grade_id"),
  );
  const [selectedPositionIds, setSelectedPositionIds] = useState(
    searchParams.getAll("position_ids") || [],
  );
  const hasMoreRef = useRef(false);
  const cursorRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchParams.get("grade_id")) {
      setSelectedGradeId(searchParams.get("grade_id"));
    } else {
      setSelectedGradeId(null);
    }

    if (searchParams.get("position_ids")) {
      setSelectedPositionIds(searchParams.get("position_ids").split(","));
    } else {
      setSelectedPositionIds([]);
    }

    if (searchParams.get("q")) {
      setSearchTerm(searchParams.get("q"));
    } else {
      setSearchTerm("");
    }
  }, [searchParams]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const resetMeta = () => {
    setQuestionsData([]);
    cursorRef.current = null;
  };

  const cleanRefetch = () => {
    resetMeta();
    refetch();
  };

  const handleSearch = useCallback(
    debounce((searchTerm) => {
      resetMeta();
      setSearchParams(
        (prev) => {
          prev.set("q", searchTerm);
          return prev;
        },
        { replace: true },
      );
    }, 500), // Debounce for 500 milliseconds
    [searchParams],
  );

  const handleSearchInputChange = (searchTerm) => {
    handleSearch(searchTerm);
  };

  const handleGradeChange = (e) => {
    resetMeta();
    setSearchParams(
      (prev) => {
        prev.set("grade_id", e.target.value);
        return prev;
      },
      { replace: true },
    );
  };

  const handlePositionsChange = (positionIds) => {
    resetMeta();
    setSearchParams(
      (prev) => {
        prev.set(
          "position_ids",
          Array.from(positionIds)
            .map((el) => Number(el))
            .filter((el) => el !== 0)
            .join(","),
        );
        return prev;
      },
      { replace: true },
    );
  };

  const queryParams = () => {
    return {
      after: cursorRef.current,
      limit: LIMIT_PER_PAGE,
      query: searchTerm,
      grade_id: selectedGradeId,
      position_ids: selectedPositionIds,
    };
  };

  const { isLoading, refetch } = useQuery(
    [searchTerm, selectedGradeId, selectedPositionIds],
    () =>
      questionsQuery(queryParams())
        .then((data) => {
          hasMoreRef.current = data.meta.has_next;
          cursorRef.current = data.meta.next_cursor;
          setQuestionsData((prevState) =>
            prevState.concat(deserialize(data).data),
          );
        })
        .catch((error) => {
          console.log(error.response.data);
          if (error.response.status === 401) showToast(UNPERMITTED, "warning");
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
        <Switch onChange={toggleFilters}>Фильтры</Switch>
        <div className="max-w-2xl w-full">
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
        <Button
          onClick={() => navigate("/questions/new", { replace: false })}
          color="primary"
          size="lg"
          variant="shadow"
        >
          Задать вопрос
        </Button>
      </div>
      {showFilters && (
        <div className="flex flex-wrap gap-6 justify-center mt-3">
          <Select
            label="Уровень сложности"
            defaultSelectedKeys={[selectedGradeId?.toString()]}
            labelPlacement="outside"
            placeholder="Выберите уровень"
            className="max-w-56"
            disableSelectorIconRotation
            onChange={handleGradeChange}
          >
            {grades.map((grade) => (
              <SelectItem key={grade.id}>{grade.grade}</SelectItem>
            ))}
          </Select>
          <Select
            label="Языки программирования"
            defaultSelectedKeys={selectedPositionIds}
            labelPlacement="outside"
            selectionMode="multiple"
            placeholder="Выберите языки"
            className="max-w-56"
            onChange={(e) =>
              handlePositionsChange(new Set(e.target.value.split(",")))
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
              <SelectItem key={option.key}>{option.label}</SelectItem>
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
              <SelectItem key={option.key}>{option.label}</SelectItem>
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
          return (
            <Question
              key={question.id}
              question={question}
              refetch={cleanRefetch}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default QuestionsPage;
