import { useMemo, useRef, useState } from "react";
import { Document, ImageRun, Packer, Paragraph, TextRun } from "docx";

const QUESTION_TYPES = {
  true_false: {
    label: "Verdadero / Falso",
    marker: "@"
  },
  single_choice: {
    label: "Opción única",
    marker: "@@"
  },
  multiple_choice: {
    label: "Opción múltiple",
    marker: "@@@"
  },
  multi_dropdown: {
    label: "Varios desplegables",
    marker: "@@@@"
  }
};

const EMPTY_OPTIONS = [
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false }
];

const EMPTY_ITEMS = [
  {
    text: "",
    options: ["Verdadero", "Falso"],
    correctAnswer: "Verdadero"
  }
];

function getOptionLetter(index) {
  return String.fromCharCode(97 + index);
}

function getTypeLabel(type) {
  return QUESTION_TYPES[type]?.label || "Pregunta";
}

function getTypeMarker(type) {
  return QUESTION_TYPES[type]?.marker || "@@";
}

function getTypeFromMarker(marker) {
  const entry = Object.entries(QUESTION_TYPES).find(([, value]) => {
    return value.marker === marker;
  });

  return entry ? entry[0] : "single_choice";
}

function createEmptyForm(type = "single_choice") {
  return {
    type,
    title: "",
    hasImage: false,
    imagePreview: null,
    trueFalseAnswer: "Verdadero",
    options: EMPTY_OPTIONS.map((option) => ({ ...option })),
    items: EMPTY_ITEMS.map((item) => ({ ...item }))
  };
}

function normalizeQuestionForEdit(question) {
  const baseForm = {
    type: question.type,
    title: question.title,
    hasImage: Boolean(question.hasImage),
    imagePreview: question.imagePreview || null,
    trueFalseAnswer: "Verdadero",
    options: EMPTY_OPTIONS.map((option) => ({ ...option })),
    items: EMPTY_ITEMS.map((item) => ({ ...item }))
  };

  if (question.type === "true_false") {
    return {
      ...baseForm,
      trueFalseAnswer: question.trueFalseAnswer || "Verdadero"
    };
  }

  if (question.type === "multi_dropdown") {
    return {
      ...baseForm,
      items: question.items.map((item) => ({
        text: item.text,
        options: item.options,
        correctAnswer: item.correctAnswer
      }))
    };
  }

  return {
    ...baseForm,
    options: question.options.map((option) => ({ ...option }))
  };
}

function buildQuestionText(question, index) {
  const marker = getTypeMarker(question.type);
  const questionNumber = index + 1;

  let text = `${marker} ${questionNumber}. ${question.title}\n`;

  if (question.hasImage) {
    text += `\n[[IMAGEN]]\n`;
  }

  if (question.type === "true_false") {
    const verdaderoMark = question.trueFalseAnswer === "Verdadero" ? " *" : "";
    const falsoMark = question.trueFalseAnswer === "Falso" ? " *" : "";

    text += `a) Verdadero${verdaderoMark}\n`;
    text += `b) Falso${falsoMark}`;

    return text.trim();
  }

  if (question.type === "multi_dropdown") {
    question.items.forEach((item, itemIndex) => {
      const optionsText = item.options
        .map((option) => {
          return option === item.correctAnswer ? `${option} *` : option;
        })
        .join(" / ");

      text += `${itemIndex + 1}) ${item.text} [${optionsText}]\n`;
    });

    return text.trim();
  }

  question.options.forEach((option, optionIndex) => {
    if (!option.text.trim()) return;

    const letter = getOptionLetter(optionIndex);
    const correctMark = option.correct ? " *" : "";

    text += `${letter}) ${option.text}${correctMark}\n`;
  });

  return text.trim();
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const binaryString = window.atob(base64);

  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index++) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return bytes;
}

function createTextParagraph(text, bold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold
      })
    ]
  });
}

function createEmptyParagraph() {
  return new Paragraph({
    children: [new TextRun("")]
  });
}

function createImageParagraph(imageDataUrl) {
  return new Paragraph({
    children: [
      new ImageRun({
        data: dataUrlToUint8Array(imageDataUrl),
        transformation: {
          width: 360,
          height: 260
        }
      })
    ]
  });
}

function buildDocxParagraphs(questions) {
  const paragraphs = [];

  questions.forEach((question, index) => {
    const marker = getTypeMarker(question.type);
    const questionNumber = index + 1;

    paragraphs.push(
      createTextParagraph(`${marker} ${questionNumber}. ${question.title}`, true)
    );

    if (question.hasImage) {
      paragraphs.push(createTextParagraph("[[IMAGEN]]"));

      if (question.imagePreview?.startsWith("data:image")) {
        paragraphs.push(createImageParagraph(question.imagePreview));
      }
    }

    if (question.type === "true_false") {
      const verdaderoMark =
        question.trueFalseAnswer === "Verdadero" ? " *" : "";
      const falsoMark = question.trueFalseAnswer === "Falso" ? " *" : "";

      paragraphs.push(createTextParagraph(`a) Verdadero${verdaderoMark}`));
      paragraphs.push(createTextParagraph(`b) Falso${falsoMark}`));
      paragraphs.push(createEmptyParagraph());
      return;
    }

    if (question.type === "multi_dropdown") {
      question.items.forEach((item, itemIndex) => {
        const optionsText = item.options
          .map((option) => {
            return option === item.correctAnswer ? `${option} *` : option;
          })
          .join(" / ");

        paragraphs.push(
          createTextParagraph(
            `${itemIndex + 1}) ${item.text} [${optionsText}]`
          )
        );
      });

      paragraphs.push(createEmptyParagraph());
      return;
    }

    question.options.forEach((option, optionIndex) => {
      if (!option.text.trim()) return;

      const letter = getOptionLetter(optionIndex);
      const correctMark = option.correct ? " *" : "";

      paragraphs.push(
        createTextParagraph(`${letter}) ${option.text}${correctMark}`)
      );
    });

    paragraphs.push(createEmptyParagraph());
  });

  return paragraphs;
}

function parseOptionLine(line) {
  const match = line.match(/^([a-zA-Z])\)\s*(.+)$/);

  if (!match) return null;

  let text = match[2].trim();
  const correct = text.endsWith("*");

  if (correct) {
    text = text.slice(0, -1).trim();
  }

  return {
    text,
    correct
  };
}

function parseMultiDropdownLine(line) {
  const match = line.match(/^(\d+)\)\s*(.+?)\s*\[(.+)\]$/);

  if (!match) return null;

  const text = match[2].trim();
  const rawOptions = match[3].split("/").map((option) => option.trim());

  const options = [];
  let correctAnswer = "";

  rawOptions.forEach((option) => {
    const isCorrect = option.endsWith("*");
    const cleanOption = isCorrect ? option.slice(0, -1).trim() : option;

    options.push(cleanOption);

    if (isCorrect) {
      correctAnswer = cleanOption;
    }
  });

  if (!text || options.length === 0 || !correctAnswer) {
    return null;
  }

  return {
    text,
    options,
    correctAnswer
  };
}

function parseQuestionsFromText(content) {
  const lines = content
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedQuestions = [];
  let currentQuestion = null;

  function pushCurrentQuestion() {
    if (!currentQuestion) return;

    if (currentQuestion.type === "true_false") {
      if (currentQuestion.title) {
        parsedQuestions.push(currentQuestion);
      }

      currentQuestion = null;
      return;
    }

    if (currentQuestion.type === "multi_dropdown") {
      if (currentQuestion.title && currentQuestion.items.length > 0) {
        parsedQuestions.push(currentQuestion);
      }

      currentQuestion = null;
      return;
    }

    const validOptions = currentQuestion.options.filter((option) =>
      option.text.trim()
    );

    if (
      currentQuestion.title &&
      validOptions.length >= 2 &&
      validOptions.some((option) => option.correct)
    ) {
      parsedQuestions.push({
        ...currentQuestion,
        options: validOptions
      });
    }

    currentQuestion = null;
  }

  lines.forEach((line) => {
    const questionMatch = line.match(/^(@{1,4})\s*\d+[\).]\s*(.+)$/);

    if (questionMatch) {
      pushCurrentQuestion();

      const marker = questionMatch[1];
      const type = getTypeFromMarker(marker);
      const title = questionMatch[2].trim();

      if (type === "true_false") {
        currentQuestion = {
          type,
          title,
          hasImage: false,
          imagePreview: null,
          trueFalseAnswer: "Verdadero"
        };
        return;
      }

      if (type === "multi_dropdown") {
        currentQuestion = {
          type,
          title,
          hasImage: false,
          imagePreview: null,
          items: []
        };
        return;
      }

      currentQuestion = {
        type,
        title,
        hasImage: false,
        imagePreview: null,
        options: []
      };

      return;
    }

    if (!currentQuestion) return;

    if (line.toUpperCase() === "[[IMAGEN]]") {
      currentQuestion.hasImage = true;
      currentQuestion.imagePreview = null;
      return;
    }

    if (currentQuestion.type === "multi_dropdown") {
      const item = parseMultiDropdownLine(line);

      if (item) {
        currentQuestion.items.push(item);
      }

      return;
    }

    const option = parseOptionLine(line);

    if (!option) return;

    if (currentQuestion.type === "true_false") {
      if (option.text.toLowerCase() === "verdadero" && option.correct) {
        currentQuestion.trueFalseAnswer = "Verdadero";
      }

      if (option.text.toLowerCase() === "falso" && option.correct) {
        currentQuestion.trueFalseAnswer = "Falso";
      }

      return;
    }

    currentQuestion.options.push(option);
  });

  pushCurrentQuestion();

  return parsedQuestions;
}
function convertProcessedQuestionToBuilderQuestion(processedQuestion) {
  const hasImage = Boolean(processedQuestion.image);

  if (processedQuestion.type === "true_false") {
    const correctOption = processedQuestion.options.find((option) =>
      processedQuestion.answers.includes(option.letter)
    );

    return {
      type: "true_false",
      title: processedQuestion.question,
      hasImage,
      imagePreview: processedQuestion.image || null,
      trueFalseAnswer: correctOption?.text || "Verdadero"
    };
  }

  if (processedQuestion.type === "multi_dropdown") {
    return {
      type: "multi_dropdown",
      title: processedQuestion.question,
      hasImage,
      imagePreview: processedQuestion.image || null,
      items: processedQuestion.items.map((item) => ({
        text: item.text,
        options: item.options,
        correctAnswer: item.answer
      }))
    };
  }

  return {
    type: processedQuestion.type,
    title: processedQuestion.question,
    hasImage,
    imagePreview: processedQuestion.image || null,
    options: processedQuestion.options.map((option) => ({
      text: option.text,
      correct: processedQuestion.answers.includes(option.letter)
    }))
  };
}
function QuestionBuilder({ onBack }) {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(createEmptyForm());
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const isEditing = editingIndex !== null;

  const previewText = useMemo(() => {
    return questions
      .map((question, index) => buildQuestionText(question, index))
      .join("\n\n");
  }, [questions]);

  function updateForm(field, value) {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value
    }));
  }

  function handleTypeChange(type) {
    setForm(createEmptyForm(type));
    setEditingIndex(null);
  }

  function resetForm() {
    setForm(createEmptyForm(form.type));
    setEditingIndex(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

function handleImageChange(event) {
  const selectedImage = event.target.files[0];

  if (!selectedImage) return;

  const reader = new FileReader();

  reader.onload = () => {
    setForm((previousForm) => ({
      ...previousForm,
      hasImage: true,
      imagePreview: reader.result
    }));
  };

  reader.readAsDataURL(selectedImage);
}
  function removeImage() {
    setForm((previousForm) => ({
      ...previousForm,
      hasImage: false,
      imagePreview: null
    }));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function updateOption(index, field, value) {
    setForm((previousForm) => ({
      ...previousForm,
      options: previousForm.options.map((option, optionIndex) => {
        if (optionIndex !== index) return option;

        return {
          ...option,
          [field]: value
        };
      })
    }));
  }

  function markSingleCorrect(index) {
    setForm((previousForm) => ({
      ...previousForm,
      options: previousForm.options.map((option, optionIndex) => ({
        ...option,
        correct: optionIndex === index
      }))
    }));
  }

  function toggleMultipleCorrect(index) {
    setForm((previousForm) => ({
      ...previousForm,
      options: previousForm.options.map((option, optionIndex) => {
        if (optionIndex !== index) return option;

        return {
          ...option,
          correct: !option.correct
        };
      })
    }));
  }

  function addOption() {
    setForm((previousForm) => ({
      ...previousForm,
      options: [
        ...previousForm.options,
        {
          text: "",
          correct: false
        }
      ]
    }));
  }

  function removeOption(index) {
    if (form.options.length <= 2) {
      alert("Debe haber al menos dos opciones");
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      options: previousForm.options.filter((_, optionIndex) => {
        return optionIndex !== index;
      })
    }));
  }

  function updateItem(index, field, value) {
    setForm((previousForm) => ({
      ...previousForm,
      items: previousForm.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        return {
          ...item,
          [field]: value
        };
      })
    }));
  }

  function addItem() {
    setForm((previousForm) => ({
      ...previousForm,
      items: [
        ...previousForm.items,
        {
          text: "",
          options: ["Verdadero", "Falso"],
          correctAnswer: "Verdadero"
        }
      ]
    }));
  }

  function removeItem(index) {
    if (form.items.length <= 1) {
      alert("Debe haber al menos una afirmación");
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      items: previousForm.items.filter((_, itemIndex) => {
        return itemIndex !== index;
      })
    }));
  }

  function validateForm() {
    if (!form.title.trim()) {
      alert("Escribí el enunciado de la pregunta");
      return false;
    }

    if (form.type === "true_false") {
      return true;
    }

    if (form.type === "multi_dropdown") {
      const validItems = form.items.filter((item) => item.text.trim());

      if (validItems.length === 0) {
        alert("Agregá al menos una afirmación");
        return false;
      }

      return true;
    }

    const validOptions = form.options.filter((option) => option.text.trim());
    const hasCorrectAnswer = validOptions.some((option) => option.correct);

    if (validOptions.length < 2) {
      alert("Agregá al menos dos opciones");
      return false;
    }

    if (!hasCorrectAnswer) {
      alert("Marcá al menos una respuesta correcta");
      return false;
    }

    return true;
  }

  function buildQuestionFromForm() {
    if (form.type === "true_false") {
      return {
        type: form.type,
        title: form.title.trim(),
        hasImage: form.hasImage,
        imagePreview: form.imagePreview,
        trueFalseAnswer: form.trueFalseAnswer
      };
    }

    if (form.type === "multi_dropdown") {
      return {
        type: form.type,
        title: form.title.trim(),
        hasImage: form.hasImage,
        imagePreview: form.imagePreview,
        items: form.items
          .filter((item) => item.text.trim())
          .map((item) => ({
            text: item.text.trim(),
            options: item.options,
            correctAnswer: item.correctAnswer
          }))
      };
    }

    return {
      type: form.type,
      title: form.title.trim(),
      hasImage: form.hasImage,
      imagePreview: form.imagePreview,
      options: form.options
        .filter((option) => option.text.trim())
        .map((option) => ({
          text: option.text.trim(),
          correct: option.correct
        }))
    };
  }

  function saveQuestion() {
    if (!validateForm()) return;

    const newQuestion = buildQuestionFromForm();

    if (isEditing) {
      setQuestions((previousQuestions) =>
        previousQuestions.map((question, questionIndex) => {
          if (questionIndex !== editingIndex) return question;
          return newQuestion;
        })
      );

      setEditingIndex(null);
      setForm(createEmptyForm(newQuestion.type));
      return;
    }

    setQuestions((previousQuestions) => [...previousQuestions, newQuestion]);
    setForm(createEmptyForm(form.type));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function editQuestion(index) {
    const question = questions[index];

    setForm(normalizeQuestionForEdit(question));
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteQuestion(index) {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta pregunta?"
    );

    if (!confirmDelete) return;

    setQuestions((previousQuestions) =>
      previousQuestions.filter((_, questionIndex) => {
        return questionIndex !== index;
      })
    );

    if (editingIndex === index) {
      resetForm();
    }
  }

async function exportQuestions() {
  if (questions.length === 0) {
    alert("Primero agregá alguna pregunta");
    return;
  }

  const document = new Document({
    sections: [
      {
        properties: {},
        children: buildDocxParagraphs(questions)
      }
    ]
  });

  const blob = await Packer.toBlob(document);

  downloadBlob(blob, "preguntas-joyacards.docx");
}

 async function importQuestions(event) {
  const selectedFile = event.target.files[0];

  if (!selectedFile) return;

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    const response = await fetch(`${apiUrl}/api/word/to-json?shuffle=false`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo importar el archivo");
    }

    const importedQuestions = data.questions.map(
      convertProcessedQuestionToBuilderQuestion
    );

    if (importedQuestions.length === 0) {
      alert("No se detectaron preguntas válidas en el archivo");
      return;
    }

    const shouldReplace =
      questions.length === 0 ||
      window.confirm(
        "¿Querés reemplazar las preguntas actuales?\nAceptar: reemplazar\nCancelar: agregar al final"
      );

    if (shouldReplace) {
      setQuestions(importedQuestions);
    } else {
      setQuestions((previousQuestions) => [
        ...previousQuestions,
        ...importedQuestions
      ]);
    }

    setEditingIndex(null);
    setForm(createEmptyForm());

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo importar el archivo");
  }
}

  return (
    <main className="container builder-page">
      <section className="card builder-hero">
        <div>
          <h1>Crear preguntas</h1>
          <p>
            Armá tus preguntas, editá el formato y exportalas para usarlas en
            JoyaCards.
          </p>
        </div>

        <button className="secondary-button" onClick={onBack}>
          Volver
        </button>
      </section>

      <section className="card builder-import-card">
        <div>
          <h2>Continuar desde un archivo</h2>
          <p>
Podés importar un `.docx` exportado anteriormente o armado con el formato de JoyaCards para seguir agregando o editando preguntas.
          </p>
        </div>

        <label className="import-button">
          Importar archivo
            <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={importQuestions}
            />
        </label>
      </section>

      <section className="card builder-card">
        <div className="builder-section-title">
          <h2>{isEditing ? "Editar pregunta" : "Nueva pregunta"}</h2>

          {isEditing && (
            <span className="editing-badge">
              Editando pregunta {editingIndex + 1}
            </span>
          )}
        </div>

        <div className="builder-grid">
          <label className="builder-field">
            Tipo de pregunta
            <select
              value={form.type}
              onChange={(event) => handleTypeChange(event.target.value)}
            >
              {Object.entries(QUESTION_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>

          <label className="builder-field builder-field-wide">
            Enunciado
            <textarea
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Ej: ¿Cuál es la capital de Argentina?"
            />
          </label>
        </div>

        <div className="builder-image-panel">
          <div>
            <h3>Imagen de la pregunta</h3>
            <p>
              Si agregás imagen, al exportar se insertará el marcador
              <strong> [[IMAGEN]]</strong>. Después pegá la imagen debajo de ese
              marcador en Word.
            </p>
          </div>

          <div className="builder-image-actions">
            <div className="builder-image-actions">
            <label className="image-upload-card-button">
                <span className="image-upload-card-icon">🖼️</span>

                <span className="image-upload-card-text">
                <strong>Cargar imagen</strong>
                <small>JPG, PNG o WEBP</small>
                </span>

                <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                />
            </label>
            </div>

            {form.hasImage && (
              <button className="danger-button" onClick={removeImage}>
                Quitar imagen
              </button>
            )}
          </div>

          {form.hasImage && (
            <div className="builder-image-preview">
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="Vista previa" />
              ) : (
                <span>Esta pregunta tiene marcador de imagen.</span>
              )}
            </div>
          )}
        </div>

        {form.type === "true_false" && (
          <div className="builder-panel">
            <h3>Respuesta correcta</h3>

            <div className="true-false-options">
              <label
                className={`answer-pill ${
                  form.trueFalseAnswer === "Verdadero" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="true-false-answer"
                  checked={form.trueFalseAnswer === "Verdadero"}
                  onChange={() => updateForm("trueFalseAnswer", "Verdadero")}
                />
                <span>Verdadero</span>
                {form.trueFalseAnswer === "Verdadero" && (
                  <strong className="correct-selected-label">Correcta</strong>
                )}
              </label>

              <label
                className={`answer-pill ${
                  form.trueFalseAnswer === "Falso" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="true-false-answer"
                  checked={form.trueFalseAnswer === "Falso"}
                  onChange={() => updateForm("trueFalseAnswer", "Falso")}
                />
                <span>Falso</span>
                {form.trueFalseAnswer === "Falso" && (
                  <strong className="correct-selected-label">Correcta</strong>
                )}
              </label>
            </div>
          </div>
        )}

        {(form.type === "single_choice" || form.type === "multiple_choice") && (
          <div className="builder-panel">
            <div className="panel-header">
              <h3>Opciones</h3>

              <button className="secondary-button" onClick={addOption}>
                Agregar opción
              </button>
            </div>

            <div className="option-editor-list">
              {form.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-editor-row ${
                    option.correct ? "correct-row" : ""
                  }`}
                >
                  <span className="option-letter">{getOptionLetter(index)})</span>

                  <input
                    value={option.text}
                    onChange={(event) =>
                      updateOption(index, "text", event.target.value)
                    }
                    placeholder="Texto de la opción"
                  />

                  <label className="correct-toggle">
                    <input
                      type={
                        form.type === "multiple_choice" ? "checkbox" : "radio"
                      }
                      name="builder-correct-answer"
                      checked={option.correct}
                      onChange={() => {
                        if (form.type === "multiple_choice") {
                          toggleMultipleCorrect(index);
                        } else {
                          markSingleCorrect(index);
                        }
                      }}
                    />

                    {option.correct && (
                      <strong className="correct-selected-label">
                        Correcta
                      </strong>
                    )}
                  </label>

                  <button
                    className="icon-button danger-button"
                    onClick={() => removeOption(index)}
                    type="button"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {form.type === "multi_dropdown" && (
          <div className="builder-panel">
            <div className="panel-header">
              <h3>Afirmaciones con desplegable</h3>

              <button className="secondary-button" onClick={addItem}>
                Agregar afirmación
              </button>
            </div>

            <div className="dropdown-editor-list">
              {form.items.map((item, index) => (
                <div key={index} className="dropdown-editor-row">
                  <span className="option-letter">{index + 1})</span>

                  <input
                    value={item.text}
                    onChange={(event) =>
                      updateItem(index, "text", event.target.value)
                    }
                    placeholder="Ej: Buenos Aires es la capital de Argentina."
                  />

                  <select
                    value={item.correctAnswer}
                    onChange={(event) =>
                      updateItem(index, "correctAnswer", event.target.value)
                    }
                  >
                    <option value="Verdadero">Verdadero</option>
                    <option value="Falso">Falso</option>
                  </select>

                  <button
                    className="icon-button danger-button"
                    onClick={() => removeItem(index)}
                    type="button"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="builder-actions">
          <button onClick={saveQuestion}>
            {isEditing ? "Guardar cambios" : "Agregar pregunta"}
          </button>

          {isEditing && (
            <button className="secondary-button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </section>

      <section className="card builder-list-card">
        <div className="panel-header">
          <div>
            <h2>Preguntas creadas</h2>
            <p>{questions.length} pregunta(s) cargada(s)</p>
          </div>

          <div className="builder-actions-inline">
            <button
              className="secondary-button"
              onClick={() => setShowPreview((previous) => !previous)}
              disabled={questions.length === 0}
            >
              {showPreview ? "Ocultar formato" : "Ver formato"}
            </button>

            <button onClick={exportQuestions} disabled={questions.length === 0}>
              Exportar archivo
            </button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="empty-state">Todavía no agregaste preguntas.</div>
        ) : (
          <div className="question-list-scroll">
            {questions.map((question, index) => (
              <div key={index} className="question-list-item">
                <div className="question-list-main">
                  <span className="question-number">{index + 1}</span>

                  <div>
                    <span className="question-list-badge">
                      {getTypeMarker(question.type)} -{" "}
                      {getTypeLabel(question.type)}
                      {question.hasImage ? " · Con imagen" : ""}
                    </span>
                    <h3>{question.title}</h3>
                  </div>
                </div>

                <div className="question-list-actions">
                  <button
                    className="secondary-button"
                    onClick={() => editQuestion(index)}
                  >
                    Editar
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => deleteQuestion(index)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPreview && questions.length > 0 && (
          <pre className="format-preview">{previewText}</pre>
        )}
      </section>
    </main>
  );
}

export default QuestionBuilder;