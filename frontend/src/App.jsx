import { useEffect, useRef, useState } from "react";
import "./App.css";
import QuestionBuilder from "./QuestionBuilder";
import QuestionImageViewer from "./components/QuestionImageViewer.jsx";
import { uploadWordToJson } from "./services/wordApi";
import {
  areAnswersCorrect,
  areMultiDropdownAnswersCorrect,
  canAdvanceQuizQuestion,
  formatTime,
  prepareQuizQuestions,
  summarizeQuiz,
  toggleAnswerSelection
} from "./utils/quizUtils.js";
import {
  advanceErrorReview,
  assignReviewQuestionIds,
  createErrorReviewProgress,
  finishErrorReview,
  finishOriginalRound,
  getErrorReviewSummary,
  recordOriginalAnswer,
  recordReviewAnswer
} from "./utils/errorReview.js";
import {
  readErrorReviewEnabled,
  saveErrorReviewEnabled
} from "./utils/errorReviewPreferences.js";
import {
  readJustificationsEnabled,
  saveJustificationsEnabled
} from "./utils/justificationPreferences.js";
import {
  readThemePreference,
  saveThemePreference
} from "./utils/themePreferences.js";

function AppFrame({ theme, onThemeToggle, children }) {
  const nextThemeLabel = theme === "dark" ? "Modo claro" : "Modo oscuro";

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="theme-toolbar">
        <button
          className="theme-toggle"
          type="button"
          onClick={onThemeToggle}
          aria-label={`Cambiar a ${nextThemeLabel.toLowerCase()}`}
          aria-pressed={theme === "dark"}
        >
          <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          <span>{nextThemeLabel}</span>
        </button>
      </div>
      {children}
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showWelcome, setShowWelcome] = useState(true);
  const [theme, setTheme] = useState(readThemePreference);

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [justificationCount, setJustificationCount] = useState(0);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [justificationsEnabled, setJustificationsEnabled] = useState(
    readJustificationsEnabled
  );
  const [errorReviewEnabled, setErrorReviewEnabled] = useState(
    readErrorReviewEnabled
  );

  const [selectedAmount, setSelectedAmount] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyProgress, setStudyProgress] = useState(() =>
    createErrorReviewProgress()
  );
  const answerSubmittedRef = useRef(false);
  const advanceHandledRef = useRef(false);

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [multiDropdownAnswers, setMultiDropdownAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [openJustificationId, setOpenJustificationId] = useState(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (quizQuestions.length === 0 || studyProgress.phase === "complete") return;

    const intervalId = setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [quizQuestions.length, studyProgress.phase]);

  useEffect(() => {
    saveJustificationsEnabled(justificationsEnabled);
  }, [justificationsEnabled]);

  useEffect(() => {
    saveErrorReviewEnabled(errorReviewEnabled);
  }, [errorReviewEnabled]);

  useEffect(() => {
    advanceHandledRef.current = false;
  }, [
    currentIndex,
    studyProgress.phase,
    studyProgress.activeReviewId,
    studyProgress.activeAnswerRecorded
  ]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    saveThemePreference(nextTheme);
    setTheme(nextTheme);
  }

  function resetQuestionResponse() {
    setSelectedAnswers([]);
    setMultiDropdownAnswers({});
    setResult(null);
    setOpenJustificationId(null);
    answerSubmittedRef.current = false;
  }

  function resetReviewSession() {
    setStudyProgress(createErrorReviewProgress());
    answerSubmittedRef.current = false;
    advanceHandledRef.current = false;
  }

  function resetStateForNewFile(selectedFile) {
    setFile(selectedFile);
    setQuestions([]);
    setJustificationCount(0);
    setWarnings([]);
    setSelectedAmount("");
    setQuizQuestions([]);
    setCurrentIndex(0);
    resetQuestionResponse();
    resetReviewSession();
    setElapsedSeconds(0);
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
      resetQuestionResponse();
      resetReviewSession();
      setElapsedSeconds(0);

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

    const selectedQuestions = prepareQuizQuestions(
      assignReviewQuestionIds(questions),
      amount
    );

    setQuizQuestions(selectedQuestions);
    setCurrentIndex(0);
    resetQuestionResponse();
    setStudyProgress(createErrorReviewProgress({
      enabled: errorReviewEnabled,
      scoreableCount: selectedQuestions.filter(
        (question) => question.isUnscored !== true
      ).length
    }));
    advanceHandledRef.current = false;
    setElapsedSeconds(0);
  }

  function selectSingleAnswer(letter) {
    if (result || answerSubmittedRef.current) return;
    setSelectedAnswers([letter]);
  }

  function toggleMultipleAnswer(letter) {
    if (result || answerSubmittedRef.current) return;
    setSelectedAnswers((previousAnswers) => toggleAnswerSelection(previousAnswers, letter));
  }

  function handleMultiDropdownChange(itemId, value) {
    if (result || answerSubmittedRef.current) return;

    setMultiDropdownAnswers((previousAnswers) => ({
      ...previousAnswers,
      [itemId]: value
    }));
  }

  function handleJustificationsToggle(enabled) {
    setOpenJustificationId(null);
    setJustificationsEnabled(enabled);
  }

  function getActiveQuestion() {
    if (studyProgress.phase === "review") {
      return quizQuestions.find(
        (question) => question.reviewId === studyProgress.activeReviewId
      );
    }

    return quizQuestions[currentIndex];
  }

  function verifyAnswer() {
    const currentQuestion = getActiveQuestion();
    if (
      !currentQuestion ||
      currentQuestion.isUnscored === true ||
      result ||
      answerSubmittedRef.current
    ) return;

    let isCorrect;

    if (currentQuestion.type === "multi_dropdown") {
      const totalItems = currentQuestion.items.length;
      const answeredItems = currentQuestion.items.filter(
        (item) => multiDropdownAnswers[item.id]
      ).length;

      if (answeredItems < totalItems) {
        alert("Complet\u00e1 todos los desplegables antes de verificar");
        return;
      }

      isCorrect = areMultiDropdownAnswersCorrect(
        currentQuestion.items,
        multiDropdownAnswers
      );
    } else {
      if (selectedAnswers.length === 0) {
        alert("Seleccion\u00e1 al menos una opci\u00f3n");
        return;
      }

      isCorrect = areAnswersCorrect(selectedAnswers, currentQuestion.answers);
    }

    answerSubmittedRef.current = true;

    if (studyProgress.phase === "review") {
      setStudyProgress((progress) => recordReviewAnswer(progress, {
        questionId: currentQuestion.reviewId,
        isCorrect
      }));
    } else {
      setStudyProgress((progress) => recordOriginalAnswer(progress, {
        questionId: currentQuestion.reviewId,
        isCorrect,
        isScored: currentQuestion.isUnscored !== true
      }));
    }

    setResult({ isCorrect });
  }

  function goToNextQuestion() {
    if (advanceHandledRef.current) return;

    const currentQuestion = getActiveQuestion();
    if (!canAdvanceQuizQuestion(currentQuestion, result)) {
      alert("Primero ten\u00e9s que verificar la respuesta");
      return;
    }

    advanceHandledRef.current = true;

    if (studyProgress.phase === "review") {
      const nextProgress = advanceErrorReview(studyProgress);
      if (nextProgress === studyProgress) {
        advanceHandledRef.current = false;
        return;
      }

      setStudyProgress(nextProgress);
      if (nextProgress.phase === "review") {
        const nextIndex = quizQuestions.findIndex(
          (question) => question.reviewId === nextProgress.activeReviewId
        );
        if (nextIndex >= 0) setCurrentIndex(nextIndex);
      }
      resetQuestionResponse();
      return;
    }

    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestionResponse();
      return;
    }

    const finishedProgress = finishOriginalRound(studyProgress);
    if (finishedProgress.phase === "review") {
      setStudyProgress(finishedProgress);
      const firstReviewIndex = quizQuestions.findIndex(
        (question) => question.reviewId === finishedProgress.activeReviewId
      );
      if (firstReviewIndex >= 0) setCurrentIndex(firstReviewIndex);
      resetQuestionResponse();
      return;
    }

    const summary = summarizeQuiz(
      quizQuestions,
      studyProgress.originalCorrectCount
    );
    alert(
      `Terminaste el simulacro\nTarjetas presentadas: ${summary.presentedCount}\nCalificables: ${summary.scoreableCount}\nPr\u00e1ctica sin puntuaci\u00f3n: ${summary.unscoredCount}\nCorrectas: ${summary.correctCount} de ${summary.scoreableCount}\nTiempo: ${formatTime(elapsedSeconds)}`
    );
    resetQuiz();
  }

  function finishReviewEarly() {
    if (studyProgress.phase !== "review" || advanceHandledRef.current) return;

    const pendingCount = studyProgress.reviewQueue.length;
    if (
      pendingCount > 0 &&
      !window.confirm(
        `Quedan ${pendingCount} errores pendientes. \u00bfQuer\u00e9s finalizar el repaso?`
      )
    ) {
      return;
    }

    advanceHandledRef.current = true;
    setStudyProgress(finishErrorReview(studyProgress));
    resetQuestionResponse();
  }

  function resetQuiz() {
    setQuizQuestions([]);
    setCurrentIndex(0);
    resetQuestionResponse();
    resetReviewSession();
    setElapsedSeconds(0);
  }

  function returnToQuestionSetup() {
    setQuizQuestions([]);
    setCurrentIndex(0);
    resetQuestionResponse();
    resetReviewSession();
    setElapsedSeconds(0);
  }

  function clearAll() {
    setFile(null);
    setQuestions([]);
    setJustificationCount(0);
    setWarnings([]);
    setSelectedAmount("");
    setQuizQuestions([]);
    setCurrentIndex(0);
    resetQuestionResponse();
    resetReviewSession();
    setElapsedSeconds(0);
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

  const isErrorReview = studyProgress.phase === "review";
  const currentQuestion = getActiveQuestion();
  const quizSummary = summarizeQuiz(
    quizQuestions,
    studyProgress.originalCorrectCount
  );
  const errorReviewSummary = getErrorReviewSummary(studyProgress);

  if (currentPage === "builder") {
    return (
      <AppFrame theme={theme} onThemeToggle={toggleTheme}>
        <QuestionBuilder onBack={() => setCurrentPage("home")} />
      </AppFrame>
    );
  }

  if (showWelcome) {
    return (
      <AppFrame theme={theme} onThemeToggle={toggleTheme}>
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
      </AppFrame>
    );
  }

  return (
    <AppFrame theme={theme} onThemeToggle={toggleTheme}>
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

          <label className="justification-toggle error-review-setting">
            <span>
              <strong>Repaso de errores</strong>
              <small>Al terminar, repetir solo las preguntas incorrectas.</small>
            </span>
            <input
              type="checkbox"
              checked={errorReviewEnabled}
              onChange={(event) => setErrorReviewEnabled(event.target.checked)}
              aria-label="Repaso de errores"
            />
            <span className="toggle-track" aria-hidden="true" />
          </label>

          <button onClick={startQuiz}>Empezar simulacro</button>
        </section>
      )}

      {quizQuestions.length > 0 && studyProgress.phase === "complete" && (
        <section className="card error-review-summary" aria-live="polite">
          <h1>Repaso finalizado</h1>
          <p className="review-summary-intro">
            El resultado del primer intento se conserva por separado del progreso del repaso.
          </p>

          <div className="review-summary-grid">
            <article className="review-summary-panel">
              <h2>Resultado original</h2>
              <p className="review-score">
                {errorReviewSummary.originalResult.correctCount}/
                {errorReviewSummary.originalResult.scoreableCount}{" - "}{errorReviewSummary.originalResult.percentage}%
              </p>
              <p>Correctas: {errorReviewSummary.originalResult.correctCount}</p>
              <p>Incorrectas: {errorReviewSummary.originalResult.incorrectCount}</p>
            </article>

            <article className="review-summary-panel">
              <h2>Resultado después del repaso</h2>
              <p className="review-score">
                {errorReviewSummary.afterReviewCorrectCount}/
                {errorReviewSummary.originalResult.scoreableCount}{" - "}{errorReviewSummary.afterReviewPercentage}%
              </p>
              <p>
                Errores corregidos: {errorReviewSummary.errorsCorrected}/
                {errorReviewSummary.errorsTotal}
              </p>
              <p>Errores pendientes: {errorReviewSummary.errorsPending}</p>
            </article>
          </div>

          <button onClick={returnToQuestionSetup}>Volver a la configuración</button>
        </section>
      )}

      {quizQuestions.length > 0 && studyProgress.phase !== "complete" && currentQuestion && (
        <section className={isErrorReview ? "card error-review-card" : "card"}>
          <div className="quiz-top-info">
            <p className="file-used">
              Archivo utilizado: <strong>{file?.name}</strong>
            </p>

            <div className="quiz-stats">
              <span>Tiempo: {formatTime(elapsedSeconds)}</span>
              {isErrorReview ? (
                <span>
                  Resultado original: {studyProgress.originalCorrectCount}/
                  {quizSummary.scoreableCount}
                </span>
              ) : (
                <span>
                  Correctas: {studyProgress.originalCorrectCount} / {quizSummary.scoreableCount}
                </span>
              )}
              {isErrorReview && (
                <span className="review-pending-count">
                  Errores pendientes: {studyProgress.reviewQueue.length}
                </span>
              )}
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
                {isErrorReview ? (
                  <div className="error-review-heading">
                    <h2>Repaso de errores</h2>
                    <span className="review-badge">Pregunta en corrección</span>
                  </div>
                ) : (
                  <p>
                    Pregunta {currentIndex + 1} de {quizQuestions.length}
                  </p>
                )}
                <span className="question-type-badge">
                  {getQuestionTypeLabel(currentQuestion.type)}
                </span>
              </div>

              <button
                className={isErrorReview ? "danger-button" : "secondary-button"}
                onClick={isErrorReview ? finishReviewEarly : resetQuiz}
              >
                {isErrorReview ? "Finalizar repaso" : "Salir"}
              </button>
            </div>
          </div>

          <h2>{currentQuestion.question}</h2>

          {currentQuestion.image && (
            <QuestionImageViewer
              key={`${currentQuestion.reviewId}-${isErrorReview ? studyProgress.reviewAttempts : "normal"}`}
              questionKey={currentQuestion.reviewId}
              image={currentQuestion.image}
              altText="Imagen de la pregunta"
              questionText={currentQuestion.question}
            />
          )}

          {currentQuestion.afterImageText && (
            <p className="after-image-annotation">{currentQuestion.afterImageText}</p>
          )}

          {currentQuestion.isUnscored === true && (
            <div className="unscored-notice" role="status">
              <strong>Práctica sin puntuación</strong>
              <span>Esta tarjeta no afecta el resultado del simulacro.</span>
            </div>
          )}

          {renderQuestionInput(currentQuestion)}

          {!result && currentQuestion.isUnscored !== true && (
            <button onClick={verifyAnswer}>Verificar</button>
          )}

          {currentQuestion.isUnscored === true && (
            <button onClick={goToNextQuestion}>
              {currentIndex === quizQuestions.length - 1
                ? "Finalizar sin puntuar"
                : "Continuar sin puntuar"}
            </button>
          )}

          {result && currentQuestion.isUnscored !== true && (
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
                {isErrorReview
                  ? studyProgress.reviewQueue.length === 0
                    ? "Ver resultados"
                    : "Continuar repaso"
                  : currentIndex === quizQuestions.length - 1
                    ? "Finalizar"
                    : "Siguiente"}
              </button>
            </div>
          )}
        </section>
      )}
      </main>
    </AppFrame>
  );
}

export default App;
