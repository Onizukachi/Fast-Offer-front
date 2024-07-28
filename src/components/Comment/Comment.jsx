import "./Comment.module.css";
import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { gravatarUrl } from "@utils/gravatarUrl";
import { BiSolidCommentDetail } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";
import LikeButton from "@components/LikeButton";
import moment from "moment/min/moment-with-locales";
import {
  createCommentQuery,
  deleteCommentQuery,
  updateCommentQuery,
} from "./queries";
import { useMutation } from "react-query";
import { showToast } from "@utils/toast";
import { Textarea } from "@nextui-org/input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import AuthContext from "@context/AuthContext.jsx";
import AuthorInfo from "@components/AuthorInfo/index.js";

const Comment = ({
  comment,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
}) => {
  const { user } = useContext(AuthContext);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [showInput, setShowInput] = useState(false);
  const [newCommentBody, setNewCommentBody] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedBody, setEditedBody] = useState(comment.body);
  const [createErrors, setCreateErrors] = useState([]);
  const [updateErrors, setUpdateErrors] = useState([]);

  const author = comment.author.data.attributes;

  useEffect(() => {
    setEditedBody(comment.body);
  }, [comment.body]);

  useEffect(() => {
    setLikesCount(comment.likes_count);
  }, [comment.likes_count]);

  const createCommentMutation = useMutation({
    mutationFn: () => createCommentQuery(comment.id, "Comment", newCommentBody),
    onSuccess: (data) => {
      setNewCommentBody("");
      onSubmitComment(comment.id, data[0]);
      toggleInput();
      showToast("Комментарий оставлен");
    },
    onError: (error) => {
      console.log(error.response.data);
      setCreateErrors(error.response.data);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: () => updateCommentQuery(comment.id, editedBody),
    onSuccess: (data) => {
      setEditMode(false);
      setUpdateErrors([]);
      onEditComment(comment.id, data[0]);
      showToast("Комментарий отредактирован");
    },
    onError: (error) => {
      console.log(error.response.data);
      setUpdateErrors(error.response.data);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: () => deleteCommentQuery(comment.id),
    onSuccess: () => {
      onDeleteComment(comment.id);
      showToast("Комментарий успешно удален");
    },
    onError: (error) => {
      console.log(error.response.data);
      showToast("Не получилось удалить комментарий", "error");
    },
  });

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedBody(comment.body);
  };

  const handleInputChange = (e) => {
    if (editMode) {
      setEditedBody(e.target.value);
    } else {
      setNewCommentBody(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (newCommentBody) {
      createCommentMutation.mutate();
    }
  };

  const handleEditSubmit = () => {
    updateCommentMutation.mutate();
  };

  const handleAction = (action) => {
    switch (action) {
      case "delete":
        deleteCommentMutation.mutate();
        break;
      case "edit":
        toggleEditMode();
        break;
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
                  onAction={handleAction}
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
        {!editMode ? (
          <div
            id="entity"
            className="mt-2 text-lg"
            dangerouslySetInnerHTML={{ __html: comment.body }}
          />
        ) : (
          <div className="mt-2">
            <Textarea
              variant={"bordered"}
              autoFocus={true}
              fullWidth={true}
              value={editedBody}
              onChange={handleInputChange}
              isInvalid={updateErrors.length > 0}
              errorMessage={updateErrors.join(". ")}
              classNames={{
                inputWrapper: ["bg-white"],
              }}
            />
            <div className="mt-2 flex gap-2">
              <Button
                color="default"
                variant={"shadow"}
                onPress={handleEditSubmit}
                isDisabled={!editedBody}
              >
                Cохранить
              </Button>
              <Button
                color="default"
                variant={"shadow"}
                onPress={() => toggleEditMode()}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4 mt-4 sm:gap-0 items-start sm:items-center flex-col sm:flex-row">
          <div className="flex -ml-3">
            <div
              onClick={() => toggleInput()}
              className="flex hover:bg-gray-200 cursor-pointer rounded-lg px-3 py-2"
            >
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

        {showInput && (
          <div className="mt-2">
            <Textarea
              variant={"bordered"}
              autoFocus={true}
              placeholder="Введите ваш комментарий"
              fullWidth={true}
              value={newCommentBody}
              onChange={handleInputChange}
              isInvalid={createErrors.length > 0}
              errorMessage={createErrors.join(". ")}
              classNames={{
                inputWrapper: ["bg-white"],
              }}
            />
            <div className="mt-2 flex gap-2">
              <Button
                color="default"
                variant={"shadow"}
                onPress={handleSubmit}
                isDisabled={!newCommentBody}
              >
                Комментировать
              </Button>
              <Button
                color="default"
                variant={"shadow"}
                onPress={() => toggleInput()}
              >
                Отмена
              </Button>
            </div>
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
