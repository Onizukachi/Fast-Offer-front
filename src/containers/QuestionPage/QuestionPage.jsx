import {useMutation, useQuery} from "react-query";
import {
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef
} from "react";
import { fetchQuestion } from "./queries";
import {Divider, Spinner} from "@nextui-org/react";
import Question from "@components/Questions/Question";
import { NavLink, useParams } from "react-router-dom";
import AuthContext from "@context/AuthContext.jsx";
import { gravatarUrl } from "@utils/gravatarUrl";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@nextui-org/react";
import { MdComment } from "react-icons/md";
import { createAnswerQuery, updateAnswerQuery, deleteAnswerQuery } from "./queries";
import { showToast } from "@utils/toast";
import { normalizeCountForm } from '@utils/normalizeCountForm'
import Answer from "@components/Question/Answer"

const QuestionPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [editorPlainText, setEditorPlainText] = useState("");
  const quillRef = useRef(null);

  const resetAnswerEditor = () => {
    setEditorContent("");
    setEditorPlainText("");
  };

  const { data, isSuccess, isLoading } = useQuery(
    `question`,
    () => fetchQuestion(id).then((data) => data),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  const createAnswerMutation = useMutation({
    mutationFn: () => createAnswerQuery(id, editorContent),
    onSuccess: (data) => {
      setQuestion({
        ...question,
        answers_count: question.answers_count + 1,
        answers: [data['answer'], ...question.answers]
      });
      resetAnswerEditor();
      showToast("Ответ успешно создан");
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });

  const handleSubmitAnswer = () => {
    createAnswerMutation.mutate();
  };

  useEffect(() => {
    if (isSuccess) setQuestion(data["question"]);
  }, [data]);

  const handleEditorChange = (content, editor) => {
    setEditorPlainText(editor.getText());
    setEditorContent(content);
  };

  const validateAnswer = () => {
    return editorPlainText.length >= 6;
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          [
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "code",
            "code-block",
          ],
          [{ list: "ordered" }, { list: "bullet" }, "link"],
          [{ align: [] }],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {isLoading && <Spinner size="lg" color="primary" />}
      {question && (
        <>
          <Question question={question} />
          <div className="px-8 py-4 rounded-lg shadow-md">
            <h1 className="text-3xl ">Ответить на вопрос</h1>
            <div className="mt-4 flex flex-row">
              <a className="hidden sm:flex items-center basis-28" href="#">
                <img
                  className="ml-0 mr-4 sm:mx-4 w-12 h-12 object-cover rounded-full sm:block"
                  src={gravatarUrl(user.gravatar_hash)}
                  alt="avatar"
                />
              </a>
              <ReactQuill
                className="h-34 grow"
                theme="snow"
                modules={modules}
                value={editorContent}
                onChange={(content, delta, source, editor) => {
                  handleEditorChange(content, editor);
                }}
                ref={quillRef}
                placeholder={"Введите текст ответа"}
              />
            </div>
            <div className="ml-0 sm:ml-28 mt-20 flex flex-row gap-4 items-center flex-wrap">
              <Button
                size="lg"
                startContent={<MdComment size="1.4em" />}
                className=" text-lg"
                color="primary"
                onClick={handleSubmitAnswer}
                isDisabled={!validateAnswer()}
              >
                Ответить
              </Button>
              <p className="underline">
                Пожалуйста, отвечайте серьезно, уважайте других пользователей
                сайта
              </p>
            </div>
          </div>
          <div className="px-8 py-4 rounded-lg shadow-md">
            <h1 className="text-3xl ">{`${question["answers"].length} ${normalizeCountForm(question["answers"].length, ["ответ", "ответа", "ответов"])}`}</h1>
            <div className='flex flex-col gap-6'>
              {question["answers"]?.map((answer) => {
                return <Answer key={answer.id} answer={answer} />
              })}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default QuestionPage;
