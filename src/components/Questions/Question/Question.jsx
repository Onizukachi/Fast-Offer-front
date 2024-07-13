import styles from "./Question.module.css";
import PropTypes from "prop-types";
import { Chip } from "@nextui-org/react";
import { useEffect, useState, useMemo } from "react";
import moment from "moment/min/moment-with-locales";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import LikeButton from "@components/Questions/LikeButton";
import Positions from "@components/Questions/Positions/Positions.jsx";
import AuthorInfo from "@components/Questions/AuthorInfo/index.js";

const Question = ({ question }) => {
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
          {question.body}
        </NavLink>
      </div>
      <div className="flex justify-between gap-4 mt-2 sm:gap-0 items-start sm:items-center flex-col sm:flex-row">
        <div className="flex gap-5">
          <div className="flex">
            <BiSolidCommentDetail size="1.4em" />
            <p className="ml-2">{question.answers_count}</p>
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
        <div>
          <AuthorInfo author={author} />
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-4 sm:gap-2 mt-1">
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
};

export default Question;
