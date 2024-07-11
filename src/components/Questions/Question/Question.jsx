import styles from "./Question.module.css";
import PropTypes from "prop-types";
import { Chip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import moment from "moment/min/moment-with-locales";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { getPositionImageUrl } from "@utils/imageUtil";
import { NavLink } from "react-router-dom";
import LikeButton from "@components/Questions/LikeButton";
import { gravatarUrl } from "@utils/gravatarUrl";
import {Divider} from "@nextui-org/react";

const Question = ({ question }) => {
  const [likeCount, setLikeCount] = useState(question.like_count);

  useEffect(() => {
    setLikeCount(question.like_count);
  }, [question.like_count]);

  return (
    <div className="px-8 py-4 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center">
        <span className="text-default-500">
          {moment(question.created_at).format("LL")}
        </span>
        <div className="flex gap-3">
          {question.positions.map((position) => {
            return (
              <NavLink key={position.id} to="/">
                <img
                  className={styles.positionImg}
                  src={getPositionImageUrl(position.image_filename)}
                  alt={position.title}
                ></img>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="mt-2">
        <NavLink to={ `/questions/${question.id}` } className="font-bold text-xl hover:opacity-80">
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
            <p className="ml-2">{new Intl.NumberFormat('ru', { notation: 'compact', maximumFractionDigits: 1 }).format(question.views_count)}</p>
          </div>
          <div className="flex">
            <LikeButton
              setLikeCount={setLikeCount}
              initState={question.liked}
              likeableId={question.id}
              likeableType={'Question'}
            />
            <p className="ml-2">{new Intl.NumberFormat('ru', { notation: 'compact', maximumFractionDigits: 1 }).format(likeCount)}</p>
          </div>
        </div>
        <div>
          <a className="flex items-center" href="#">
            <img
              className="ml-0 mr-4 sm:mx-4 w-10 h-10 object-cover rounded-full sm:block"
              src={gravatarUrl(question.author.gravatar_hash)}
              alt="avatar"
            />
            <h1 className="text-medium font-bold">
              {question.author.nickname}
            </h1>
          </a>
        </div>
      </div>
      {question.tags?.length > 0 && (
        <div className="flex flex-wrap gap-4 sm:gap-2 mt-1">
          {question.tags.map((tag) => {
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
