import "./Answer.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { gravatarUrl } from "@utils/gravatarUrl";
import { BiSolidCommentDetail } from "react-icons/bi";
import LikeButton from "@components/LikeButton";
import moment from "moment/min/moment-with-locales";
import { normalizeCountForm } from "@utils/normalizeCountForm";
import Comment from "@components/Comment";
import { commentsQuery } from "./queries";
import {useMutation, useQuery} from "react-query";
import {createCommentQuery} from "@components/Comment/queries.js";
import {showToast} from "@utils/toast.js";
import {Textarea} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import useCommentTree from "@components/Comment/useCommentTree.js";

const Answer = ({ answer }) => {
  const [likesCount, setLikesCount] = useState(answer.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentErrors, setCommentErrors] = useState("")
  const [commentBody, setCommentBody] = useState("")
  const [commentsCount, setCommentsCount] = useState(0);

  const {
    comments: commentsData,
    insertComment,
    editComment,
    deleteComment
  } = useCommentTree(comments);

  const deepCountComments = (rootObjects) => {
    let count = 0;

    function recurse(objects) {
      objects.forEach((obj) => {
        count++;
        if (obj.children && Array.isArray(obj.children)) {
          recurse(obj.children);
        }
      });
    }

    recurse(rootObjects);
    return count;
  };

  useEffect(() => {
    setLikesCount(answer.likes_count);
  }, [answer.likes_count]);

  useQuery(
    `comments-${answer.id}`,
    () =>
      commentsQuery(answer.id, "Answer").then((data) => {
        setCommentsCount(deepCountComments(data));
        setComments(data);
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  const createCommentMutation = useMutation({
    mutationFn: () => createCommentQuery(answer.id, 'Answer', commentBody),
    onSuccess: (data) => {
      setCommentBody("")
      handleReply(undefined, data[0]);
      showToast("Комментарий оставлен");
    },
    onError: (error) => {
      // setAnswerErrors(error.response.data);
      console.log(error.response.data);
      let errorsMsg = []
      //
      //     console.log(error.response.data.errors)
      //
      //     for (const [key, value] of Object.entries(error.response.data.errors)) {
      //       errorsMsg.push(`${key} ${value}`);
      //     }
      //
      //     setCommentErrors(errorsMsg.join(". "))
    },
  });

  const handleReply = (commentId, content) => {
    insertComment(commentId, content);
  };

  const handleEdit = (commentId, content) => {
    editComment(commentId, content);
  };

  const handleDelete = (commentId) => {
    deleteComment(commentId);
  };

  const handleSubmit = () => {
    if (commentBody) {
      createCommentMutation.mutate()
    }
  };

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
          <div
            onClick={() => setShowComments(!showComments)}
            className="flex hover:bg-gray-200 cursor-pointer rounded-lg px-3 py-2"
          >
            <BiSolidCommentDetail size="1.4em" />
            <p className="ml-2">{commentsCount}</p>
            <p className="ml-2 text-default-500">
              {normalizeCountForm(commentsCount, [
                "Комментарий",
                "Комментария",
                "Комментариев",
              ])}
            </p>
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
      {showComments && (
        <div className="mt-2">
          <Textarea
            variant={"bordered"}
            autoFocus={true}
            placeholder="Введите ваш комментарий"
            fullWidth={true}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            isInvalid={false}
            errorMessage={'ERRORRR'}
            classNames={{
              inputWrapper: ["bg-white"],
            }}
          />
          <Button
            className="mt-2"
            color="default"
            variant={"shadow"}
            onClick={handleSubmit}
          >
            Комментировать
          </Button>
        </div>
      )}
      <div className="mt-2">
        {showComments &&
          commentsData.map((comment) => {
            return <Comment key={comment.id} comment={comment} onSubmitComment={handleReply}
                            onEditComment={handleEdit}
                            onDeleteComment={handleDelete} />;
          })}
      </div>
    </div>
  );
};

Answer.propTypes = {
  answer: PropTypes.object,
};

export default Answer;
