import "./Comment.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { gravatarUrl } from "@utils/gravatarUrl";
import { BiSolidCommentDetail } from "react-icons/bi";
import LikeButton from "@components/LikeButton";
import moment from "moment/min/moment-with-locales";

const Comment = ({ comment }) => {
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  useEffect(() => {
    setLikesCount(comment.likes_count);
  }, [comment.likes_count]);

  return (
    <div key={comment.id} className="bg-gray-100 rounded-lg shadow-md px-8 py-4 mt-4 flex flex-col">
      <div className="flex flex-wrap justify-between items-center">
        <span className="text-default-500">
          {moment(comment.created_at).format("LL")}
        </span>
        <a className="flex items-center" href="#">
          <img
            className="ml-0 mr-4 sm:mx-4 w-10 h-10 object-cover rounded-full sm:block"
            src={gravatarUrl(comment.author.gravatar_hash)}
            alt="avatar"
          />
          <h1 className="text-medium font-bold">{comment.author.nickname}</h1>
        </a>
      </div>
      <div
        id="entity"
        className="mt-2 text-lg"
        dangerouslySetInnerHTML={{ __html: comment.body }}
      />
      <div className="flex justify-between gap-4 mt-4 sm:gap-0 items-start sm:items-center flex-col sm:flex-row">
        <div className="flex -ml-3">
          <div className="flex hover:bg-gray-200 cursor-pointer rounded-lg px-3 py-2">
            <BiSolidCommentDetail size="1.4em" />
            <p className="ml-2 text-default-500">Ответить</p>
          </div>
          <div className="flex px-3 py-2">
            <LikeButton
              setLikesCount={setLikesCount}
              initState={comment.liked}
              likeableId={comment.id}
              likeableType={"Comment"}
            />
            <p className="ml-2">
              {new Intl.NumberFormat("ru", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(likesCount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
};

export default Comment;