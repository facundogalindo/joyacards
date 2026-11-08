import { useEffect, useState } from "react";
import "./App.css";
import QuestionBuilder from "./QuestionBuilder";
import { uploadWordToJson } from "./services/wordApi";
import {
  areAnswersCorrect,
  areMultiDropdownAnswersCorrect,
  formatTime,
  prepareQuizQuestions
} from "./utils/quizUtils.js";
import {
  readJustificationsEnabled,
  saveJustificationsEnabled
} from "./utils/justificationPreferences.js";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showWelcome, setShowWelcome] = useState(true);

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [justificationCount, setJustificationCount] = useState(0);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [justificationsEnabled, setJustificationsEnabled] = useState(
    readJustificationsEnabled
  );

  const [selectedAmount, setSelectedAmount] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [multiDropdownAnswers, setMultiDropdownAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [openJustificationId, setOpenJustificationId] = useState(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (quizQuestions.length === 0) return;

    const intervalId = setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [quizQuestions.length]);

  useEffect(() => {
    saveJustificationsEnabled(justificationsEnabled);
  }, [justificationsEnabled]);

  function resetStateForNewFile(selectedFile) {
    setFile(selectedFile);
    setQuestions([]);
    setJustificationCount(0);
    setWarnings([]);
    setSelectedAmount("");
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setMultiDropdownAnswers({});
    setResult(null);
    setOpenJustificationId(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  async function handleUploadWord() {
    if (!file) {
      alert("Primero seleccioná un archivo Word");
      return;
    }

    try {
      setLoading(true);

      const data = await uploadWordToJson(file, {
        shuffle: true
      });

      setQuestions(data.questions);
      setJustificationCount(data.justificationCount || 0);
      setWarnings(data.warnings || []);
      setSelectedAmount(data.questions.length);

      setQuizQuestions([]);
      setCurrentIndex(0);
      setSelectedAnswers([]);
      setMultiDropdownAnswers({});
      setResult(null);
      setOpenJustificationId(null);
      setElapsedSeconds(0);
      setCorrectCount(0);

      console.log("JSON recibido:", data.questions);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function startQuiz() {
    const amount = Number(selectedAmount);

    if (!amount || amount <= 0) {
      alert("Ingresá una cantidad válida");
      return;
    }

    if (amount > questions.length) {
      alert(`Solo hay ${questions.length} preguntas disponibles`);
      return;
    }

    const selectedQuestions = prepareQuizQuestions(questions, amount);

    setQuizQuestions(selectedQuestions);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setMultiDropdownAnswers({});
    setResult(null);
    setOpenJustificationId(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  function selectSingleAnswer(letter) {
    if (result) return;
    setSelectedAnswers([letter]);
  }

  function toggleMultipleAnswer(letter) {
    if (result) return;

    setSelectedAnswers((previousAnswers) => {
      if (previousAnswers.includes(letter)) {
        return previousAnswers.filter((answer) => answer !== letter);
      }

      return [...previousAnswers, letter];
    });
  }

  function handleMultiDropdownChange(itemId, value) {
    if (result) return;

    setMultiDropdownAnswers((previousAnswers) => ({
      ...previousAnswers,
      [itemId]: value
    }));
  }

  function handleJustificationsToggle(enabled) {
    setOpenJustificationId(null);
    setJustificationsEnabled(enabled);
  }

  function verifyAnswer() {
    const currentQuestion = quizQuestions[currentIndex];

    let isCorrect;

    if (currentQuestion.type === "multi_dropdown") {
      const totalItems = currentQuestion.items.length;
      const answeredItems = currentQuestion.items.filter(
        (item) => multiDropdownAnswers[item.id]
      ).length;

      if (answeredItems < totalItems) {
        alert("Completá todos los desplegables antes de verificar");
        return;
      }

      isCorrect = areMultiDropdownAnswersCorrect(
        currentQuestion.items,
        multiDropdownAnswers
      );
    } else {
      if (selectedAnswers.length === 0) {
        alert("Seleccioná al menos una opción");
        return;
      }

      isCorrect = areAnswersCorrect(selectedAnswers, currentQuestion.answers);
    }

    if (isCorrect) {
      setCorrectCount((previousCount) => previousCount + 1);
    }

    setResult({
      isCorrect
    });
  }

  function goToNextQuestion() {
    if (!result) {
      alert("Primero tenés que verificar la respuesta");
      return;
    }

    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswers([]);
      setMultiDropdownAnswers({});
      setResult(null);
      setOpenJustificationId(null);
      return;
    }

    alert(
      `Terminaste el simulacro\nCorrectas: ${correctCount} de ${quizQuestions.length}\nTiempo: ${formatTime(elapsedSeconds)}`
    );

    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setMultiDropdownAnswers({});
    setResult(null);
    setOpenJustificationId(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  function resetQuiz() {
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setMultiDropdownAnswers({});
    setResult(null);
    setOpenJustificationId(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  function clearAll() {
    setFile(null);
    setQuestions([]);
    setJustificationCount(0);
    setWarnings([]);
    setSelectedAmount("");
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setMultiDropdownAnswers({});
    setResult(null);
    setOpenJustificationId(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  function getQuestionTypeLabel(type) {
    const labels = {
      true_false: "Verdadero / Falso",
      single_choice: "Opción única",
      multiple_choice: "Opción múltiple",
      multi_dropdown: "Varios desplegables",
      drag_words: "Arrastrar palabras"
    };

    return labels[type] || "Pregunta";
  }

  function renderMultiDropdownQuestion(currentQuestion) {
    return (
      <div className="multi-dropdown-list">
        {currentQuestion.items.map((item) => {
          const options = item.options.map((option, index) =>
            typeof option === "string"
              ? { id: `${item.id}-option-${index + 1}`, text: option }
              : option
          );
          const selectedOption = options.find(
            (option) => option.id === multiDropdownAnswers[item.id]
          );
          const correctOption = item.answerOptionId
            ? options.find((option) => option.id === item.answerOptionId)
            : options.find((option) => option.text === item.answer);
          const isSelectedCorrect =
            selectedOption && selectedOption.id === correctOption?.id;
          const justificationId = `dropdown-${currentIndex}-${item.id}`;

          return (
            <div key={item.id} className="multi-dropdown-item">
              <p><strong>{item.id}.</strong> {item.text}</p>
              <div
                className="dropdown-answer-review"
                onPointerEnter={(event) => event.pointerType === "mouse" && result && justificationsEnabled && selectedOption?.justification && setOpenJustificationId(justificationId)}
                onPointerLeave={(event) => event.pointerType === "mouse" && setOpenJustificationId(null)}
                onPointerUp={(event) => {
                  if (
                    event.pointerType === "touch" &&
                    result &&
                    justificationsEnabled &&
                    selectedOption?.justification &&
                    !event.target.closest(".justification-trigger") &&
                    !event.target.closest(".justification-card")
                  ) {
                    setOpenJustificationId((open) => open === justificationId ? null : justificationId);
                  }
                }}
                onClick={(event) => {
                  if (event.detail === 0 && result && justificationsEnabled && selectedOption?.justification) {
                    setOpenJustificationId((open) => open === justificationId ? null : justificationId);
                  }
                }}
              >
                <select
                  value={multiDropdownAnswers[item.id] || ""}
                  onChange={(event) => handleMultiDropdownChange(item.id, event.target.value)}
                  disabled={!!result}
                  className="question-select"
                >
                  <option value="">Seleccionar...</option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>{option.text}</option>
                  ))}
                </select>
                {result && selectedOption?.justification && justificationsEnabled && (
                  renderJustification(selectedOption.justification, isSelectedCorrect, justificationId)
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderJustification(text, isCorrect, id) {
    if (!result || !justificationsEnabled || !text?.trim()) return null;
    const isOpen = openJustificationId === id;

    return (
      <>
        <button
          type="button"
          className={`justification-trigger ${isCorrect ? "is-correct" : "is-incorrect"}`}
          aria-label="Ver justificación"
          aria-expanded={isOpen}
          onClick={(event) => {
            event.stopPropagation();
            setOpenJustificationId((open) => open === id ? null : id);
          }}
        >
          ?
        </button>
        {isOpen && (
          <div className={`justification-card ${isCorrect ? "is-correct" : "is-incorrect"}`}>
            {text}
          </div>
        )}
      </>
    );
  }

  function renderQuestionInput(currentQuestion) {
    if (currentQuestion.type === "multi_dropdown") {
      return renderMultiDropdownQuestion(currentQuestion);
    }

    const inputType =
      currentQuestion.type === "multiple_choice" ? "checkbox" : "radio";

    return (
      <div className="options">
        {currentQuestion.options.map((option) => {
          const selected = selectedAnswers.includes(option.letter);
          const isCorrect =
            typeof option.isCorrect === "boolean"
              ? option.isCorrect
              : currentQuestion.answers.includes(option.letter);
          const justificationId = `option-${currentIndex}-${option.id || option.letter}`;

          return (
            <div
              key={option.id || option.letter}
              className="review-option-justification"
              onPointerEnter={(event) => event.pointerType === "mouse" && result && justificationsEnabled && selected && option.justification && setOpenJustificationId(justificationId)}
              onPointerLeave={(event) => event.pointerType === "mouse" && setOpenJustificationId(null)}
              onPointerUp={(event) => {
                if (event.pointerType === "touch" && result && selected && option.justification && justificationsEnabled && !event.target.closest(".justification-trigger") && !event.target.closest(".justification-card")) {
                  setOpenJustificationId((open) => open === justificationId ? null : justificationId);
                }
              }}
              onClick={(event) => {
                if (event.detail === 0 && result && selected && option.justification && justificationsEnabled) {
                  setOpenJustificationId((open) => open === justificationId ? null : justificationId);
                }
              }}
            >
              <label className={`option selectable ${selected ? "selected" : ""}`}>
                <input
                  type={inputType}
                  name={`question-${currentIndex}`}
                  checked={selected}
                  onChange={() => {
                    if (currentQuestion.type === "multiple_choice") {
                      toggleMultipleAnswer(option.letter);
                    } else {
                      selectSingleAnswer(option.letter);
                    }
                  }}
                  disabled={!!result}
                />
                <span><strong>{option.letter}.</strong> {option.text}</span>
              </label>
              {selected && renderJustification(option.justification, isCorrect, justificationId)}
            </div>
          );
        })}
      </div>
    );
  }

  function renderCorrectAnswers(currentQuestion) {
    if (currentQuestion.type === "multi_dropdown") {
      return (
        <ul>
          {currentQuestion.items.map((item) => {
            const correctOption = item.answerOptionId
              ? item.options.find((option) => option.id === item.answerOptionId)
              : null;
            return (
              <li key={item.id}>
                {item.id}. {item.text} → <strong>{correctOption?.text || item.answer}</strong>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <ul>
        {currentQuestion.options
          .filter((option) =>
            typeof option.isCorrect === "boolean"
              ? option.isCorrect
              : currentQuestion.answers.includes(option.letter)
          )
          .map((option) => (
            <li key={option.letter}>
              {option.letter}. {option.text}
            </li>
          ))}
      </ul>
    );
  }

  const currentQuestion = quizQuestions[currentIndex];

  if (currentPage === "builder") {
    return <QuestionBuilder onBack={() => setCurrentPage("home")} />;
  }

  if (showWelcome) {
    return (
      <main className="container">
        <section className="card welcome-card">
          <img
            src="/simulacroparajoyas.png"
            alt="Simulacro para joyas"
            className="welcome-image"
          />

          <button onClick={() => setShowWelcome(false)}>Comenzar</button>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      {quizQuestions.length === 0 && (
        <section className="card">
          <h1>JoyaCards</h1>
          <p>Cargá un Word y convertí tus preguntas en tarjetas.</p>

          <input
            type="file"
            accept=".docx"
            onChange={(event) => {
              const selectedFile = event.target.files[0] || null;
              resetStateForNewFile(selectedFile);
            }}
          />

          {file && <p>Archivo seleccionado: {file.name}</p>}

          <button onClick={handleUploadWord} disabled={loading}>
            {loading ? "Procesando..." : "Procesar archivo"}
          </button>

          <button
            className="secondary-button builder-button"
            onClick={() => setCurrentPage("builder")}
          >
            Crear mis preguntas
          </button>

          {(file || questions.length > 0) && (
            <button className="secondary-button clear-button" onClick={clearAll}>
              Limpiar
            </button>
          )}
        </section>
      )}

      {questions.length > 0 && quizQuestions.length === 0 && (
        <section className="card">
          <h2>Preguntas detectadas: {questions.length}</h2>

          {justificationCount > 0 && (
            <p className="detected-justification-count">
              Justificaciones detectadas: {justificationCount}
            </p>
          )}

          {warnings.length > 0 && (
            <div className="justification-warning justification-warning-general" role="status">
              ⚠ Se encontraron {warnings.length} justificaciones con advertencias de formato.
              {" "}
              Preguntas afectadas: {[...new Set(warnings.map((warning) => warning.questionNumber))].join(", ")}.
            </div>
          )}

          <label className="field">
            Cantidad de preguntas:
            <input
              type="number"
              min="1"
              max={questions.length}
              value={selectedAmount}
              onChange={(event) => setSelectedAmount(event.target.value)}
            />
          </label>

          <button onClick={startQuiz}>Empezar simulacro</button>
        </section>
      )}

      {quizQuestions.length > 0 && currentQuestion && (
        <section className="card">
          <div className="quiz-top-info">
            <p className="file-used">
              Archivo utilizado: <strong>{file?.name}</strong>
            </p>

            <div className="quiz-stats">
              <span>Tiempo: {formatTime(elapsedSeconds)}</span>
              <span>
                Correctas: {correctCount} / {quizQuestions.length}
              </span>
            </div>

            {justificationCount > 0 && (
              <label className="justification-toggle">
                <span>
                  <strong>Justificaciones</strong>
                  <small>Mostrar explicaciones después de responder</small>
                </span>
                <input
                  type="checkbox"
                  checked={justificationsEnabled}
                  onChange={(event) => handleJustificationsToggle(event.target.checked)}
                />
                <span className="toggle-track" aria-hidden="true" />
              </label>
            )}

            <div className="quiz-header">
              <div>
                <p>
                  Pregunta {currentIndex + 1} de {quizQuestions.length}
                </p>
                <span className="question-type-badge">
                  {getQuestionTypeLabel(currentQuestion.type)}
                </span>
              </div>

              <button className="secondary-button" onClick={resetQuiz}>
                Salir
              </button>
            </div>
          </div>

          <h2>{currentQuestion.question}</h2>

          {currentQuestion.image && (
            <img
              src={currentQuestion.image}
              alt="Imagen de la pregunta"
              className="question-image"
            />
          )}

          {renderQuestionInput(currentQuestion)}

          {!result && <button onClick={verifyAnswer}>Verificar</button>}

          {result && (
            <div className="result">
              {result.isCorrect ? (
                <div className="correct-result">
                  <img src="/joya.jpg" alt="Joya" className="result-image" />
                  <p>Respuesta correcta.</p>
                </div>
              ) : (
                <div className="wrong-result">
                  <img src="/joyita.jpg" alt="Joyita" className="result-image" />
                  <p>Las respuestas correctas eran:</p>
                  {renderCorrectAnswers(currentQuestion)}
                </div>
              )}

              <button onClick={goToNextQuestion}>
                {currentIndex === quizQuestions.length - 1
                  ? "Finalizar"
                  : "Siguiente"}
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
