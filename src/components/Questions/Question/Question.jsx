import PropTypes from "prop-types";
import {Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {useEffect, useState, useMemo, useContext} from "react";
import moment from "moment/min/moment-with-locales";
import { BiSolidCommentDetail } from "react-icons/bi";
import {FaEye, FaRegTrashAlt} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import LikeButton from "@components/LikeButton";
import Positions from "@components/Questions/Positions";
import AuthorInfo from "@components/AuthorInfo";
import {normalizeCountForm} from "@utils/normalizeCountForm";
import {CiMenuKebab} from "react-icons/ci";
import AuthContext from "@context/AuthContext";
import {MdEdit} from "react-icons/md";
import {useMutation} from "react-query";
import { deleteQuestionQuery } from "./queries";
import {showToast} from "@utils/toast.js";
import { useNavigate } from "react-router-dom";

const Question = ({ question, refetch }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { author, positions, tags } = question;
  const [likesCount, setLikesCount] = useState(question.likes_count);

  useEffect(() => {
    setLikesCount(question.likes_count);
  }, [question.likes_count]);

  const formattedDate = useMemo(
    () => moment(question.created_at).format("LL"),
    [question.created_at],
  );

  const formatNumber = (number) =>
    new Intl.NumberFormat("ru", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(number);

  const deleteQuestionMutation = useMutation({
    mutationFn: () => deleteQuestionQuery(question.id),
    onSuccess: () => {
      showToast("Вопрос успешно удален");
      refetch();
    },
    onError: (error) => {
      console.log(error.response.data);
      showToast("Не получилось удалить вопрос", "error");
    },
  });

  const handleQuestionAction = (action) => {
    switch (action) {
      case "delete":
        deleteQuestionMutation.mutate()
        break;
      case "edit":
        // TO DO
        break;
    }
  };

  return (
    <div className="px-8 py-4 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center">
        <span className="text-default-500">{formattedDate}</span>
        <Positions positions={positions} />
      </div>
      <div className="mt-2">
        <NavLink
          to={`/questions/${question.id}`}
          className="font-bold text-xl hover:opacity-80"
        >
          <div
            id="entity"
            dangerouslySetInnerHTML={{ __html: question.body }}
          />
        </NavLink>
      </div>
      <div className="flex justify-between gap-4 mt-2 sm:gap-0 items-start sm:items-center flex-col sm:flex-row">
        <div className="flex gap-5">
          <div className="flex">
            <BiSolidCommentDetail size="1.4em" />
            <p className="ml-2">{question.answers_count}</p>
            <p className="ml-2 text-default-500">
              {normalizeCountForm(question.answers_count, [
                "ответ",
                "ответа",
                "ответов",
              ])}
            </p>
          </div>
          <div className="flex">
            <FaEye size="1.4em" />
            <p className="ml-2">{formatNumber(question.views_count)}</p>
          </div>
          <div className="flex">
            <LikeButton
              setLikesCount={setLikesCount}
              initState={question.liked}
              likeableId={question.id}
              likeableType={"Question"}
            />
            <p className="ml-2">{formatNumber(likesCount)}</p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          <AuthorInfo author={author} />
          { user.id === Number(author.id) &&
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" className="min-w-0 px-0">
                  <CiMenuKebab size="1.4em" className="cursor-pointer" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={handleQuestionAction}
                variant="faded"
                aria-label="Dropdown menu with description"
              >
                <DropdownItem
                  key="edit"
                  showDivider
                  startContent={<MdEdit size="1.3em" />}
                >
                  Редактировать
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<FaRegTrashAlt size="1.3em" />}
                >
                  Удалить
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          }
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-4 sm:gap-2 sm:mt-1 mt-3">
          <Chip size="sm" color="primary" className="cursor-pointer">
            {question.grade.grade}
          </Chip>
          {tags.map((tag) => {
            return (
              <Chip key={tag.id} size="sm" className="cursor-pointer">
                {tag.name}
              </Chip>
            );
          })}
        </div>
      )}
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.object,
  refetch: PropTypes.func
};

export default Question;
