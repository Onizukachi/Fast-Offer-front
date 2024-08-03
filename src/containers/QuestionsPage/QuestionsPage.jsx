import { useQuery } from "react-query";
import {useState, useCallback, useRef, useEffect} from "react";
import { questionsQuery } from "./queries";
import Question from "@components/Question";
import { deserialize } from "deserialize-json-api";
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";
import { Input, Switch } from "@nextui-org/react";
import { IoSearchOutline } from "react-icons/io5";
import { debounce } from "lodash";
import { Button } from "@nextui-org/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "@utils/toast";
import { UNPERMITTED } from "@constants/toastMessages";
import { positionsQuery } from "@queries/positionsQuery";
import { gradesQuery } from "@queries/gradesQuery";
import FiltersBlock from "@components/Questions/FiltersBlock";
import Orders from "@components/Questions/Orders/Orders.jsx";

const LIMIT_PER_PAGE = 10;
const SORT_FIELDS = ["created_at", "answers_count"];
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
  // const [filters, setFilters] = useState({
  //   searchTerm: searchParams.get('q') || '',
  //   selectedGradeId: searchParams.get('grade_id') || null,
  //   selectedPositionIds: searchParams.getAll('position_ids') || [],
  //   sortBy: searchParams.get('sort') || '',
  //   sortOrder: searchParams.get('order') || 'asc',
  //   selectedTag: searchParams.get('tag') || null,
  // });

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedGradeId, setSelectedGradeId] = useState(
    searchParams.get("grade_id"),
  );
  const [selectedPositionIds, setSelectedPositionIds] = useState(
    searchParams.getAll("position_ids") || [],
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("order") || "asc",
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag"));
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

    if (
      searchParams.get("sort") &&
      SORT_FIELDS.includes(searchParams.get("sort"))
    ) {
      setSortBy(searchParams.get("sort"));
    } else {
      setSortBy("");
    }

    if (
      searchParams.get("order") &&
      ORDER_OPTIONS.map((el) => el.key).includes(searchParams.get("order"))
    ) {
      setSortOrder(searchParams.get("order"));
    } else {
      setSortOrder("asc");
    }

    if (searchParams.get("tag")) {
      setSelectedTag(searchParams.get("tag"));
    } else {
      setSelectedTag(null);
    }
  }, [searchParams]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const resetMeta = useCallback(() => {
    setQuestionsData([]);
    cursorRef.current = null;
    hasMoreRef.current = false;
  });

  const cleanRefetch = useCallback(() => {
    resetMeta();
    refetch();
  });

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

  const handleGradeChange = useCallback(
    (gradeId) => {
      resetMeta();
      setSearchParams(
        (prev) => {
          if (gradeId !== selectedGradeId) {
            prev.set("grade_id", gradeId);
          } else {
            prev.delete("grade_id");
          }

          return prev;
        },
        { replace: true },
      );
    },
    [searchParams, selectedGradeId],
  );

  const handleTagClick = useCallback(
    (tag) => {
      resetMeta();
      setSearchParams(
        (prev) => {
          if (tag !== selectedTag) {
            prev.set("tag", tag);
          } else {
            prev.delete("tag");
          }

          return prev;
        },
        { replace: true },
      );
    },
    [searchParams, selectedTag],
  );

  const handlePositionsChange = useCallback(
    (positionIds) => {
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
    },
    [searchParams],
  );

  const handleSortingChange = useCallback(
    (field, direction) => {
      resetMeta();
      setSearchParams(
        (prev) => {
          if (!direction || (sortBy === field && sortOrder === direction)) {
            prev.delete("sort");
            prev.delete("order");
          } else {
            prev.set("sort", field);
            prev.set("order", direction);
          }

          return prev;
        },
        { replace: true },
      );
    },
    [searchParams, sortBy, sortOrder],
  );

  const queryParams = {
    after: cursorRef.current,
    limit: LIMIT_PER_PAGE,
    query: searchTerm,
    grade_id: selectedGradeId,
    position_ids: selectedPositionIds,
    sort: sortBy,
    order: sortOrder,
    tag: selectedTag,
  };

  const { isLoading, refetch } = useQuery(
    [
      searchTerm,
      selectedGradeId,
      selectedPositionIds,
      sortBy,
      sortOrder,
      selectedTag,
    ],
    () =>
      questionsQuery(queryParams)
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
            isDisabled={isLoading}
            type="search"
            size="lg"
            onValueChange={handleSearch}
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
          <FiltersBlock
            isLoading={isLoading}
            selectedGradeId={selectedGradeId}
            handleGradeChange={handleGradeChange}
            grades={grades}
            selectedPositionIds={selectedPositionIds}
            handlePositionsChange={handlePositionsChange}
            positions={positions}
          />
          <Orders
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSortingChange={handleSortingChange}
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
              handleTagClick={handleTagClick}
              handleGradeClick={handleGradeChange}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default QuestionsPage;
