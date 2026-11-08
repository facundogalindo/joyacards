import { useEffect, useMemo, useRef, useState } from "react";
import { uploadWordToJson } from "./services/wordApi";
import {
  QUESTION_TYPES,
  buildQuestionText,
  builderQuestionToQuizQuestion,
  convertProcessedQuestionToBuilderQuestion,
  createEmptyForm,
  exportQuestionsToDocx,
  getOptionLetter,
  getTypeLabel,
  getTypeMarker,
  normalizeQuestionForEdit
} from "./utils/questionBuilderUtils.js";
import {
  areAnswersCorrect,
  areMultiDropdownAnswersCorrect
} from "./utils/quizUtils.js";

function QuestionBuilder({ onBack }) {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(createEmptyForm());
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [importWarnings, setImportWarnings] = useState([]);
  const [questionToTry, setQuestionToTry] = useState(null);

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
          correct: false,
          justification: ""
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
          options: [
            { id: `option-${Date.now()}-1`, text: "Verdadero", justification: "" },
            { id: `option-${Date.now()}-2`, text: "Falso", justification: "" }
          ],
          answerOptionId: `option-${Date.now()}-1`,
          correctAnswer: "Verdadero"
        }
      ]
    }));
  }

  function updateDropdownOption(itemIndex, optionIndex, field, value) {
    setForm((previousForm) => ({
      ...previousForm,
      items: previousForm.items.map((item, currentItemIndex) => {
        if (currentItemIndex !== itemIndex) return item;

        return {
          ...item,
          options: item.options.map((option, currentOptionIndex) =>
            currentOptionIndex === optionIndex
              ? { ...option, [field]: value }
              : option
          )
        };
      })
    }));
  }

  function addDropdownOption(itemIndex) {
    setForm((previousForm) => ({
      ...previousForm,
      items: previousForm.items.map((item, currentItemIndex) => {
        if (currentItemIndex !== itemIndex) return item;
        return {
          ...item,
          options: [
            ...item.options,
            {
              id: `option-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              text: "",
              justification: ""
            }
          ]
        };
      })
    }));
  }

  function removeDropdownOption(itemIndex, optionIndex) {
    setForm((previousForm) => ({
      ...previousForm,
      items: previousForm.items.map((item, currentItemIndex) => {
        if (currentItemIndex !== itemIndex) return item;
        if (item.options.length <= 2) {
          alert("Debe haber al menos dos alternativas");
          return item;
        }

        const removedOption = item.options[optionIndex];
        const options = item.options.filter(
          (_, currentOptionIndex) => currentOptionIndex !== optionIndex
        );
        const answerOptionId =
          item.answerOptionId === removedOption.id
            ? options[0]?.id
            : item.answerOptionId;

        return {
          ...item,
          options,
          answerOptionId,
          correctAnswer:
            options.find((option) => option.id === answerOptionId)?.text || ""
        };
      })
    }));
  }

  function chooseDropdownAnswer(itemIndex, optionId) {
    setForm((previousForm) => ({
      ...previousForm,
      items: previousForm.items.map((item, currentItemIndex) => {
        if (currentItemIndex !== itemIndex) return item;
        return {
          ...item,
          answerOptionId: optionId,
          correctAnswer: item.options.find((option) => option.id === optionId)?.text || ""
        };
      })
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

      if (
        validItems.some(
          (item) =>
            item.options.filter((option) => option.text.trim()).length < 2 ||
            !item.options.some(
              (option) =>
                option.id === item.answerOptionId && option.text.trim()
            )
        )
      ) {
        alert("Cada afirmación necesita dos alternativas y una respuesta correcta");
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
        trueFalseAnswer: form.trueFalseAnswer,
        trueFalseJustifications: form.trueFalseJustifications,
        invalidJustifications: form.invalidJustifications || []
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
            options: item.options
              .filter((option) => option.text.trim())
              .map((option) => ({ ...option, text: option.text.trim() })),
            answerOptionId: item.answerOptionId,
            correctAnswer: item.correctAnswer
          })),
        invalidJustifications: form.invalidJustifications || []
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
          correct: option.correct,
          justification: option.justification || ""
        })),
      invalidJustifications: form.invalidJustifications || []
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

    await exportQuestionsToDocx(questions);
  }

  async function importQuestions(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    try {
      const data = await uploadWordToJson(selectedFile, {
        shuffle: false
      });

      const importedQuestions = data.questions.map((question, questionIndex) =>
        convertProcessedQuestionToBuilderQuestion(
          question,
          (data.warnings || []).filter(
            (warning) => warning.questionIndex === questionIndex
          )
        )
      );

      setImportWarnings(data.warnings || []);

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
            Podés importar un `.docx` exportado anteriormente o armado con el
            formato de JoyaCards para seguir agregando o editando preguntas.
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

      {importWarnings.length > 0 && (
        <div className="justification-warning justification-warning-general" role="status">
          ⚠ Se encontraron {importWarnings.length} justificaciones con advertencias de formato.
          {" "}
          Preguntas afectadas: {[...new Set(importWarnings.map((warning) => warning.questionNumber))].join(", ")}.
        </div>
      )}

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
          </div>

        <div className="builder-image-actions">
          <label className="image-upload-card">
            <span className="image-upload-icon">🖼️</span>

            <span className="image-upload-text">
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

          {form.hasImage && (
            <button className="danger-button remove-image-button" onClick={removeImage}>
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
            <h3>Verdadero / Falso</h3>

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

              <label className="answer-justification-field">
                Justificación (opcional)
                <textarea
                  value={form.trueFalseJustifications?.Verdadero || ""}
                  onChange={(event) =>
                    updateForm("trueFalseJustifications", {
                      ...form.trueFalseJustifications,
                      Verdadero: event.target.value
                    })
                  }
                  rows="3"
                />
              </label>
              {form.invalidJustifications?.some((warning) => warning.option === "A") && (
                <p className="justification-warning">
                  ⚠ Justificación inválida en la opción A (Verdadero)
                </p>
              )}

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

              <label className="answer-justification-field">
                Justificación (opcional)
                <textarea
                  value={form.trueFalseJustifications?.Falso || ""}
                  onChange={(event) =>
                    updateForm("trueFalseJustifications", {
                      ...form.trueFalseJustifications,
                      Falso: event.target.value
                    })
                  }
                  rows="3"
                />
              </label>
              {form.invalidJustifications?.some((warning) => warning.option === "B") && (
                <p className="justification-warning">
                  ⚠ Justificación inválida en la opción B (Falso)
                </p>
              )}
            </div>
          </div>
        )}

        {(form.type === "single_choice" || form.type === "multiple_choice") && (
          <div className="builder-panel">
            <div className="panel-header">
              <div>
                <h3>Opciones</h3>
                <p className="panel-helper-text">
                  {form.type === "multiple_choice"
                    ? "Podés marcar varias respuestas correctas."
                    : "Marcá una sola respuesta correcta."}
                </p>
              </div>

              <button className="secondary-button" onClick={addOption}>
                Agregar opción
              </button>
            </div>

            <div className="option-editor-list">
              {form.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-card ${
                    option.correct ? "option-card-correct" : ""
                  }`}
                >
                  <p className="option-card-title">Opción {index + 1}</p>

                  <input
                    value={option.text}
                    onChange={(event) =>
                      updateOption(index, "text", event.target.value)
                    }
                    placeholder="Texto de la opción"
                  />

                  <label className="answer-justification-field">
                    Justificación (opcional)
                    <textarea
                      value={option.justification || ""}
                      onChange={(event) =>
                        updateOption(index, "justification", event.target.value)
                      }
                      rows="3"
                    />
                  </label>

                  {form.invalidJustifications?.some(
                    (warning) => warning.option === getOptionLetter(index).toUpperCase()
                  ) && (
                    <p className="justification-warning">
                      ⚠ Justificación inválida en la opción {getOptionLetter(index).toUpperCase()}
                    </p>
                  )}

                  <div className="option-card-actions">
                    <button
                      type="button"
                      className={`option-icon-button correct-icon-button ${
                        option.correct ? "active" : ""
                      }`}
                      title={
                        option.correct
                          ? "Marcada como correcta"
                          : "Marcar como correcta"
                      }
                      onClick={() => {
                        if (form.type === "multiple_choice") {
                          toggleMultipleCorrect(index);
                        } else {
                          markSingleCorrect(index);
                        }
                      }}
                    >
                      ✓
                    </button>

                    <button
                      type="button"
                      className="option-icon-button delete-icon-button"
                      title="Eliminar opción"
                      onClick={() => removeOption(index)}
                    >
                      🗑
                    </button>
                  </div>
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
                <div key={index} className="dropdown-editor-item">
                  <div className="dropdown-editor-row">
                    <span className="option-letter">{index + 1})</span>
                    <input
                      value={item.text}
                      onChange={(event) => updateItem(index, "text", event.target.value)}
                      placeholder="Ej: DNS utiliza"
                    />
                    <button
                      className="icon-button danger-button"
                      onClick={() => removeItem(index)}
                      type="button"
                    >
                      Eliminar afirmación
                    </button>
                  </div>

                  <div className="dropdown-option-editor-list">
                    {item.options.map((option, optionIndex) => (
                      <div className="dropdown-option-editor" key={option.id}>
                        <div className="dropdown-option-heading">
                          <label>
                            <input
                              type="radio"
                              name={`dropdown-answer-${index}`}
                              checked={item.answerOptionId === option.id}
                              onChange={() => chooseDropdownAnswer(index, option.id)}
                            />
                            Correcta
                          </label>
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => removeDropdownOption(index, optionIndex)}
                          >
                            Eliminar alternativa
                          </button>
                        </div>
                        <input
                          value={option.text}
                          onChange={(event) =>
                            updateDropdownOption(index, optionIndex, "text", event.target.value)
                          }
                          placeholder={`Alternativa ${optionIndex + 1}`}
                        />
                        <label className="answer-justification-field">
                          Justificación (opcional)
                          <textarea
                            value={option.justification || ""}
                            onChange={(event) =>
                              updateDropdownOption(index, optionIndex, "justification", event.target.value)
                            }
                            rows="2"
                          />
                        </label>
                        {form.invalidJustifications?.some(
                          (warning) => warning.itemIndex === index && warning.optionIndex === optionIndex
                        ) && (
                          <p className="justification-warning">
                            ⚠ Justificación inválida en el ítem {item.id || index + 1}, opción {optionIndex + 1}
                          </p>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => addDropdownOption(index)}
                    >
                      Agregar alternativa
                    </button>
                  </div>
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
                    {question.invalidJustifications?.length > 0 && (
                      <p className="justification-warning">
                        ⚠ Hay justificaciones con formato inválido en esta pregunta.
                      </p>
                    )}
                  </div>
                </div>

                <div className="question-list-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setQuestionToTry(builderQuestionToQuizQuestion(question))}
                  >
                    Probar
                  </button>
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
      {questionToTry && (
        <QuestionTryModal
          question={questionToTry}
          onClose={() => setQuestionToTry(null)}
        />
      )}
      </section>
    </main>
  );
}

function QuestionTryModal({ question, onClose }) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [dropdownAnswers, setDropdownAnswers] = useState({});
  const [verified, setVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [openJustificationId, setOpenJustificationId] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function toggleAnswer(letter, multiple) {
    if (verified) return;
    setSelectedAnswers((previous) => {
      if (!multiple) return [letter];
      return previous.includes(letter)
        ? previous.filter((answer) => answer !== letter)
        : [...previous, letter];
    });
  }

  function verify() {
    if (question.type === "multi_dropdown") {
      if (question.items.some((item) => !dropdownAnswers[item.id])) {
        setValidationMessage("Completá todos los desplegables antes de verificar.");
        return;
      }
      setIsCorrect(areMultiDropdownAnswersCorrect(question.items, dropdownAnswers));
    } else {
      if (selectedAnswers.length === 0) {
        setValidationMessage("Seleccioná al menos una opción.");
        return;
      }
      setIsCorrect(areAnswersCorrect(selectedAnswers, question.answers));
    }
    setValidationMessage("");
    setVerified(true);
  }

  function toggleJustification(id) {
    setOpenJustificationId((current) => (current === id ? null : id));
  }

  function renderJustification(text, correct, id) {
    if (!verified || !text?.trim()) return null;
    const isOpen = openJustificationId === id;
    return (
      <>
        <button
          type="button"
          className={`justification-trigger ${correct ? "is-correct" : "is-incorrect"}`}
          aria-label="Ver justificación"
          aria-expanded={isOpen}
          onClick={(event) => {
            event.stopPropagation();
            toggleJustification(id);
          }}
        >
          ?
        </button>
        {isOpen && (
          <div className={`justification-card ${correct ? "is-correct" : "is-incorrect"}`}>
            {text}
          </div>
        )}
      </>
    );
  }

  function renderOptions() {
    if (question.type === "multi_dropdown") {
      return (
        <div className="multi-dropdown-list">
          {question.items.map((item) => {
            const chosen = item.options.find((option) => option.id === dropdownAnswers[item.id]);
            const correct = dropdownAnswers[item.id] === item.answerOptionId;
            const id = `try-item-${item.id}`;
            return (
              <div className="multi-dropdown-item" key={item.id}>
                <p><strong>{item.id}.</strong> {item.text}</p>
                <div
                  className="dropdown-answer-review"
                  onPointerEnter={(event) => event.pointerType === "mouse" && verified && chosen?.justification && setOpenJustificationId(id)}
                  onPointerLeave={(event) => event.pointerType === "mouse" && setOpenJustificationId(null)}
                  onPointerUp={(event) => {
                    if (
                      event.pointerType === "touch" &&
                      verified &&
                      chosen?.justification &&
                      !event.target.closest(".justification-trigger") &&
                      !event.target.closest(".justification-card")
                    ) {
                      toggleJustification(id);
                    }
                  }}
                  onClick={(event) => {
                    if (event.detail === 0 && verified && chosen?.justification) {
                      toggleJustification(id);
                    }
                  }}
                >
                  <select
                    value={dropdownAnswers[item.id] || ""}
                    disabled={verified}
                    onChange={(event) => setDropdownAnswers((previous) => ({ ...previous, [item.id]: event.target.value }))}
                  >
                    <option value="">Seleccionar...</option>
                    {item.options.map((option) => (
                      <option value={option.id} key={option.id}>{option.text}</option>
                    ))}
                  </select>
                  {verified && chosen && chosen.justification?.trim() && (
                    renderJustification(chosen.justification, correct, id)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const inputType = question.type === "multiple_choice" ? "checkbox" : "radio";
    return (
      <div className="options">
        {question.options.map((option) => {
          const selected = selectedAnswers.includes(option.letter);
          const correct = question.answers.includes(option.letter);
          const id = `try-option-${option.id || option.letter}`;
          return (
            <div
              key={option.id || option.letter}
              className="review-option-justification"
              onPointerEnter={(event) => event.pointerType === "mouse" && selected && option.justification && setOpenJustificationId(id)}
              onPointerLeave={(event) => event.pointerType === "mouse" && setOpenJustificationId(null)}
              onPointerUp={(event) => {
                if (event.pointerType === "touch" && verified && selected && option.justification && !event.target.closest(".justification-trigger") && !event.target.closest(".justification-card")) {
                  toggleJustification(id);
                }
              }}
              onClick={(event) => {
                if (event.detail === 0 && verified && selected && option.justification) {
                  toggleJustification(id);
                }
              }}
            >
              <label className={`option selectable ${selected ? "selected" : ""}`}>
                <input
                  type={inputType}
                  name="try-question"
                  checked={selected}
                  disabled={verified}
                  onChange={() => toggleAnswer(option.letter, inputType === "checkbox")}
                />
                <span><strong>{option.letter}.</strong> {option.text}</span>
              </label>
              {selected && renderJustification(option.justification, correct, id)}
            </div>
          );
        })}
      </div>
    );
  }

  function renderCorrectAnswers() {
    if (question.type === "multi_dropdown") {
      return (
        <ul>
          {question.items.map((item) => (
            <li key={item.id}>{item.id}. {item.text} → <strong>{item.answer}</strong></li>
          ))}
        </ul>
      );
    }
    return (
      <ul>
        {question.options.filter((option) => question.answers.includes(option.letter)).map((option) => (
          <li key={option.id || option.letter}>{option.letter}. {option.text}</li>
        ))}</ul>
    );
  }

  return (
    <div className="preview-modal-backdrop" role="presentation">
      <section className="preview-modal card" role="dialog" aria-modal="true" aria-labelledby="try-question-title">
        <div className="preview-modal-heading">
          <h2 id="try-question-title">Probar pregunta</h2>
          <button type="button" className="secondary-button preview-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <h3>{question.question}</h3>
        {question.image && <img src={question.image} alt="Imagen de la pregunta" className="question-image" />}
        {renderOptions()}
        {validationMessage && <p className="inline-validation">{validationMessage}</p>}
        {!verified && <button type="button" onClick={verify}>Verificar</button>}
        {verified && (
          <div className="result">
            {isCorrect ? (
              <div className="correct-result"><img src="/joya.jpg" alt="Joya" className="result-image" /><p>Respuesta correcta.</p></div>
            ) : (
              <div className="wrong-result"><img src="/joyita.jpg" alt="Joyita" className="result-image" /><p>Las respuestas correctas eran:</p>{renderCorrectAnswers()}</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default QuestionBuilder;
