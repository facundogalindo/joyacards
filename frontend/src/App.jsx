import { useEffect, useState } from "react";
import "./App.css";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function areAnswersCorrect(selectedAnswers, correctAnswers) {
  if (selectedAnswers.length !== correctAnswers.length) {
    return false;
  }

  return selectedAnswers.every((answer) => correctAnswers.includes(answer));
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (quizQuestions.length === 0) return;

    const intervalId = setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [quizQuestions.length]);

  function resetStateForNewFile(selectedFile) {
    setFile(selectedFile);
    setQuestions([]);
    setSelectedAmount("");
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setResult(null);
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

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/api/word/to-json", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al convertir Word a JSON");
      }

      setQuestions(data.questions);
      setSelectedAmount(data.questions.length);

      setQuizQuestions([]);
      setCurrentIndex(0);
      setSelectedAnswers([]);
      setResult(null);
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

    const selectedQuestions = shuffleArray(questions).slice(0, amount);

    setQuizQuestions(selectedQuestions);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setResult(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  function toggleAnswer(letter) {
    if (result) return;

    setSelectedAnswers((previousAnswers) => {
      if (previousAnswers.includes(letter)) {
        return previousAnswers.filter((answer) => answer !== letter);
      }

      return [...previousAnswers, letter];
    });
  }

  function verifyAnswer() {
    if (selectedAnswers.length === 0) {
      alert("Seleccioná al menos una opción");
      return;
    }

    const currentQuestion = quizQuestions[currentIndex];

    const isCorrect = areAnswersCorrect(
      selectedAnswers,
      currentQuestion.answers
    );

    if (isCorrect) {
      setCorrectCount((previousCount) => previousCount + 1);
    }

    setResult({
      isCorrect,
      correctAnswers: currentQuestion.answers
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
      setResult(null);
      return;
    }

    alert(
      `Terminaste el tarjetero\nCorrectas: ${correctCount} de ${quizQuestions.length}\nTiempo: ${formatTime(elapsedSeconds)}`
    );

    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setResult(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  function resetQuiz() {
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setResult(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  function clearAll() {
    setFile(null);
    setQuestions([]);
    setSelectedAmount("");
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setResult(null);
    setElapsedSeconds(0);
    setCorrectCount(0);
  }

  const currentQuestion = quizQuestions[currentIndex];

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
            {loading ? "Procesando..." : "Convertir Word a JSON"}
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

          <button onClick={startQuiz}>Empezar tarjetero</button>
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

            <div className="quiz-header">
              <p>
                Pregunta {currentIndex + 1} de {quizQuestions.length}
              </p>

              <button className="secondary-button" onClick={resetQuiz}>
                Salir
              </button>
            </div>
          </div>

          <h2>{currentQuestion.question}</h2>

          <div className="options">
            {currentQuestion.options.map((option) => (
              <label
                key={option.letter}
                className={`option selectable ${
                  selectedAnswers.includes(option.letter) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAnswers.includes(option.letter)}
                  onChange={() => toggleAnswer(option.letter)}
                  disabled={!!result}
                />

                <span>
                  <strong>{option.letter}.</strong> {option.text}
                </span>
              </label>
            ))}
          </div>

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

                  <ul>
                    {currentQuestion.options
                      .filter((option) =>
                        result.correctAnswers.includes(option.letter)
                      )
                      .map((option) => (
                        <li key={option.letter}>
                          {option.letter}. {option.text}
                        </li>
                      ))}
                  </ul>
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