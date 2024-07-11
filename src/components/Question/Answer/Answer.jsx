import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { gravatarUrl } from "@utils/gravatarUrl.js";
import { Divider } from "@nextui-org/react";
import { BiSolidCommentDetail } from "react-icons/bi";
import LikeButton from "@components/Questions/LikeButton/index.js";
import moment from "moment/min/moment-with-locales";

const Answer = ({ answer }) => {
  const [likeCount, setLikeCount] = useState(answer.like_count);

  useEffect(() => {
    setLikeCount(answer.like_count);
  }, [answer.like_count]);

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
        className="mt-2 text-lg"
        dangerouslySetInnerHTML={{ __html: answer.body }}
      />
      <Divider className="mt-4 mb-1" />
      <div className="flex justify-between gap-4 sm:gap-0 items-start sm:items-center flex-col sm:flex-row">
        <div className="flex gap-5">
          <div className="flex">
            <BiSolidCommentDetail size="1.4em"/>
            <p className="ml-2">{13}</p>
          </div>
          <div className="flex">
            <LikeButton
              setLikeCount={setLikeCount}
              initState={answer.liked}
              likeableId={answer.id}
              likeableType={'Answer'}
            />
            <p className="ml-2">{new Intl.NumberFormat('ru', {
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(likeCount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

Answer.propTypes = {
  answer: PropTypes.object,
};

export default Answer;
