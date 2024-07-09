import { useQuery } from "react-query";
import {useContext, useEffect, useState} from "react";
import { fetchQuestion } from "./queries";
import { Spinner } from "@nextui-org/react";
import Question from "@components/Questions/Question";
import {NavLink, useParams} from 'react-router-dom';
import AuthContext from "@context/AuthContext.jsx";
import { gravatarUrl } from "@utils/gravatarUrl";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Button} from "@nextui-org/react";
import { MdComment } from "react-icons/md";

const QuestionPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [editorValue, setEditorValue] = useState('');

  const { data, isSuccess, isLoading } = useQuery(
    `question`,
    () => fetchQuestion(id).then((data) => data),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (isSuccess) setQuestion(data["question"]);
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Spinner size="lg" color="primary" />}
      {question && (
        <>
          <Question question={question} />
          <div className="px-8 py-4 rounded-lg shadow-md">
            <h1 className="text-3xl ">Ответить на вопрос</h1>
            <div className='mt-4 flex flex-row'>
              <a className="hidden sm:flex items-center basis-28" href="#">
                <img
                  className="ml-0 mr-4 sm:mx-4 w-12 h-12 object-cover rounded-full sm:block"
                  src={gravatarUrl(user.gravatar_hash)}
                  alt="avatar"
                />
              </a>

              <ReactQuill
                className='h-34 grow'
                value={editorValue}
                onChange={(value) => setEditorValue(value)}
                placeholder={'Введите текст ответа'}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline','strike', 'blockquote', 'code'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image', 'clean'],
                    ['clean']
                  ]
                }}
              />
            </div>
            <div className='ml-0 sm:ml-28 mt-20 flex flex-row gap-4 items-center flex-wrap'>
              <Button size='lg' startContent={<MdComment size="1.4em" />} className=' text-lg' color="primary">
                Ответить
              </Button>
              <p className='underline'>
                Пожалуйста, отвечайте серьезно, уважайте других пользователей сайта
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionPage;
