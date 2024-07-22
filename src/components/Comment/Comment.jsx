import "./Comment.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { gravatarUrl } from "@utils/gravatarUrl";
import { BiSolidCommentDetail } from "react-icons/bi";
import LikeButton from "@components/LikeButton";
import moment from "moment/min/moment-with-locales";
import { createCommentQuery } from "./queries";
import { useMutation } from "react-query";
import { showToast } from "@utils/toast.js";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

const Comment = ({
  comment,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [showInput, setShowInput] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const author = comment.author.data.attributes;

  const createCommentMutation = useMutation({
    mutationFn: () => createCommentQuery(comment.id, "Comment", commentBody),
    onSuccess: (data) => {
      setCommentBody("");
      onSubmitComment(comment.id, data[0]);
      setShowInput(false);
      showToast("Комментарий оставлен");
    },
    onError: (error) => {
      // setAnswerErrors(error.response.data);
      console.log(error.response.data);
    },
  });

  useEffect(() => {
    setLikesCount(comment.likes_count);
  }, [comment.likes_count]);

  const handleSubmit = () => {
    if (commentBody) {
      createCommentMutation.mutate();
    }
  };

  return (
    <>
      <div
        key={comment.id}
        className="bg-gray-100 rounded-lg shadow-md px-8 py-4 mt-4 flex flex-col"
      >
        <div className="flex flex-wrap justify-between items-center">
          <span className="text-default-500">
            {moment(comment.created_at).format("LL")}
          </span>
          <a className="flex items-center" href="#">
            <img
              className="ml-0 mr-4 sm:mx-4 w-10 h-10 object-cover rounded-full sm:block"
              src={gravatarUrl(author.gravatar_hash)}
              alt="avatar"
            />
            <h1 className="text-medium font-bold">{author.nickname}</h1>
          </a>
        </div>
        <div
          id="entity"
          className="mt-2 text-lg"
          dangerouslySetInnerHTML={{ __html: comment.body }}
        />
        <div className="flex justify-between gap-4 mt-4 sm:gap-0 items-start sm:items-center flex-col sm:flex-row">
          <div className="flex -ml-3">
            <div
              onClick={() => setShowInput(!showInput)}
              className="flex hover:bg-gray-200 cursor-pointer rounded-lg px-3 py-2"
            >
              <BiSolidCommentDetail size="1.4em" />
              <p className="ml-2 text-default-500">
                {showInput ? "Отмена" : "Ответить"}
              </p>
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

        {showInput && (
          <div className="mt-2">
            <Textarea
              variant={"bordered"}
              autoFocus={true}
              placeholder="Введите ваш комментарий"
              fullWidth={true}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              isInvalid={false}
              errorMessage={"ERRORRR"}
              classNames={{
                inputWrapper: ["bg-white"],
              }}
            />
            <Button
              className="mt-2"
              color="default"
              variant={"shadow"}
              onPress={handleSubmit}
            >
              Комментировать
            </Button>
          </div>
        )}

        {comment.children.map((child) => {
          return (
            <Comment
              key={child.id}
              comment={child}
              onSubmitComment={onSubmitComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          );
        })}
      </div>
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
  onSubmitComment: PropTypes.func,
  onEditComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
};

export default Comment;
