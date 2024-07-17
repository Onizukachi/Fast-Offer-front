import "./Answer.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { gravatarUrl } from "@utils/gravatarUrl";
import { BiSolidCommentDetail } from "react-icons/bi";
import LikeButton from "@components/LikeButton";
import moment from "moment/min/moment-with-locales";
import { normalizeCountForm } from "@utils/normalizeCountForm";
import Comment from "@components/Comment"

const Answer = ({ answer }) => {
  console.log(answer)
  const [likesCount, setLikesCount] = useState(answer.likes_count);
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    setLikesCount(answer.likes_count);
  }, [answer.likes_count]);

  return (
    <div key={answer.id} className="mt-4 flex flex-col">
      <div className="flex flex-wrap justify-between items-center">
        <span className="text-default-500">
          {moment(answer.created_at).format("LL")}
        </span>
        <a className="flex items-center" href="#">
          <img
            className="ml-0 mr-4 sm:mx-4 w-10 h-10 object-cover rounded-full sm:block"
            src={gravatarUrl(answer.author.gravatar_hash)}
            alt="avatar"
          />
          <h1 className="text-medium font-bold">{answer.author.nickname}</h1>
        </a>
      </div>
      <div
        id="entity"
        className="mt-2 text-lg"
        dangerouslySetInnerHTML={{ __html: answer.body }}
      />
      <div className="flex justify-between gap-4 mt-4 sm:gap-0 items-start sm:items-center flex-col sm:flex-row">
        <div className="flex -ml-3">
          <div onClick={() => setShowComments(!showComments) } className="flex hover:bg-gray-200 cursor-pointer rounded-lg px-3 py-2">
            <BiSolidCommentDetail size="1.4em" />
            <p className="ml-2">{answer.comments.length}</p>
            <p className="ml-2 text-default-500">{normalizeCountForm(answer.comments.length, ["Комментарий", "Комментария", "Комментариев"])}</p>
          </div>
          <div className="flex px-3 py-2">
            <LikeButton
              setLikesCount={setLikesCount}
              initState={answer.liked}
              likeableId={answer.id}
              likeableType={"Answer"}
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
      <div className="">
        { showComments && answer.comments.map((comment) => {
          return (
            <Comment key={comment.id} comment={comment} />
          )
        }) }
      </div>
    </div>
  );
};

Answer.propTypes = {
  answer: PropTypes.object,
};

export default Answer;
