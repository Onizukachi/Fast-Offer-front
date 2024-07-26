import ReactQuill from "react-quill";
import { useMemo, useRef, useState, useCallback } from "react";
import hljs from "highlight.js";
import { useMutation, useQuery } from "react-query";
import { gradesQuery, positionsQuery, tagsQuery, createQuestionQuery } from "./queries";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { deserialize } from "deserialize-json-api";
import { getPositionImageUrl } from "@utils/imageUtil";
import { showToast } from "@utils/toast.js";
import { ReactTags } from "react-tag-autocomplete";

const NewQuestionPage = () => {
  const [editorContent, setEditorContent] = useState("");
  const [editorPlainText, setEditorPlainText] = useState("");
  const [answerErrors, setAnswerErrors] = useState([]);
  const [grades, setGrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [tags, setTags] = useState([]);
  const quillRef = useRef(null);
  const [values, setValues] = useState(new Set([]));
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [selectedPositionIds, setSelectedPositionIds] = useState([]);

  hljs.configure({
    languages: [
      "javascript",
      "CSS",
      "HTML",
      "java",
      "ruby",
      "python",
      "sql",
      "json",
      "php",
    ],
  });

  useQuery(
    `grades`,
    () =>
      gradesQuery().then((data) => {
        setGrades(deserialize(data).data);
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  useQuery(
    `positions`,
    () =>
      positionsQuery().then((data) => {
        setPositions(deserialize(data).data);
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  useQuery(
    `tags`,
    () =>
      tagsQuery().then((data) => {
        setTags(deserialize(data).data);
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  const formParams = () => {
    return {
      body: getUnprivilegedEditor()?.getHTML(),
      grade_id: selectedGradeId,
      tags: selectedTags.map((tag) => tag.label),
      position_ids: Array.from(selectedPositionIds).filter((el) => el !== '')
    }
  }

  const { mutate } = useMutation({
    mutationFn: () => createQuestionQuery(formParams),
    onSuccess: () => {
      console.log('sasdsadsadsadsadsds')
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });


  const getUnprivilegedEditor = () => {
    if (!quillRef.current) return;

    const editor = quillRef.current.getEditor();
    return quillRef.current.makeUnprivilegedEditor(editor);
  };

  // console.log(getUnprivilegedEditor()?.getHTML())
  // console.log(selectedTags)
  // console.log(selectedGradeId)
  // console.log(selectedPositionIds)

  const handleEditorChange = (content, editor) => {
    setEditorPlainText(editor.getText());
    setEditorContent(editor.getHTML());
  };

  const modules = useMemo(() => {
    return {
      syntax: {
        highlight: (text) => hljs.highlightAuto(text).value,
      },
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }, "link", { align: [] }],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    };
  }, []);

  const onAdd = useCallback(
    (newTag) => {
      setSelectedTags([...selectedTags, newTag]);
    },
    [selectedTags],
  );

  const onDelete = useCallback(
    (tagIndex) => {
      setSelectedTags(selectedTags.filter((_, i) => i !== tagIndex));
    },
    [selectedTags],
  );

  const tagIsValid = (value) => /^[a-z]{2,30}$/i.test(value);

  const onTagValidate = useCallback((value) => tagIsValid(value), []);

  const validateQuestion = () => {
    console.log(selectedTags)
    return (
      editorPlainText.length > 1 &&
      selectedGradeId &&
      Array.from(selectedPositionIds).filter((el) => el !== '').length > 0
    );
  };

  const handleFormSubmit = () => {
    mutate()
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-center mb-6">Задать вопрос</h1>
      <div className="flex flex-col gap-6">
        <ReactQuill
          className="grow"
          theme="snow"
          modules={modules}
          value={editorContent}
          onChange={(content, delta, source, editor) => {
            handleEditorChange(content, editor);
          }}
          ref={quillRef}
          placeholder={"Введите текст вопроса"}
        />
        <div className="flex flex-wrap gap-6">
          <Select
            label="Уровень сложности"
            isRequired
            labelPlacement="outside"
            placeholder="Выберите уровень"
            className="max-w-xs"
            disableSelectorIconRotation
            onChange={(e) => setSelectedGradeId(e.target.value)}
          >
            {grades.map((grade) => (
              <SelectItem key={grade.id}>{grade.grade}</SelectItem>
            ))}
          </Select>
          <Select
            label="Языки программирования"
            isRequired
            labelPlacement="outside"
            selectionMode="multiple"
            placeholder="Выберите языки"
            selectedKeys={selectedPositionIds}
            className="max-w-xs"
            onChange={(e) =>
              setSelectedPositionIds(new Set(e.target.value.split(",")))
            }
          >
            {positions.map((position) => (
              <SelectItem
                key={position.id}
                startContent={
                  <img
                    className="w-6 h-6"
                    src={getPositionImageUrl(position.image_filename)}
                    alt={position.title}
                  ></img>
                }
              >
                {position.title}
              </SelectItem>
            ))}
          </Select>
        </div>
        <ReactTags
          allowNew
          collapseOnSelect
          id="tagsInput"
          labelText="Теги"
          placeholderText="Создайте или выберите теги"
          newOptionText={"Добавить %value%"}
          isInvalid={false}
          onAdd={onAdd}
          onDelete={onDelete}
          onValidate={onTagValidate}
          selected={selectedTags}
          suggestions={tags.map((tag) => {
            return { value: tag.id, label: tag.name };
          })}
        />
        <Button
          onClick={handleFormSubmit}
          className="w-44"
          color="primary"
          size="lg"
          variant="shadow"
          isDisabled={!validateQuestion()}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default NewQuestionPage;
