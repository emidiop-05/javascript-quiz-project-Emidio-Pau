document.addEventListener("DOMContentLoaded", () => {
  /************  HTML ELEMENTS  ************/
  // View divs
  const quizView = document.querySelector("#quizView");
  const endView = document.querySelector("#endView");

  // Quiz view elements
  const progressBar = document.querySelector("#progressBar");
  const questionCount = document.querySelector("#questionCount");
  const questionContainer = document.querySelector("#question");
  const choiceContainer = document.querySelector("#choices");
  const nextButton = document.querySelector("#nextButton");
  const resetBtn = document.querySelector("#restartButton");
  // End view elements
  const resultContainer = document.querySelector("#result");

  /************  SET VISIBILITY OF VIEWS  ************/

  // Show the quiz view (div#quizView) and hide the end view (div#endView)
  quizView.style.display = "block";
  endView.style.display = "none";

  /************  QUIZ DATA  ************/

  // Array with the quiz questions
  const questions = [
    new Question("What is 2 + 2?", ["3", "4", "5", "6"], "4", 1),
    new Question(
      "What is the capital of France?",
      ["Miami", "Paris", "Oslo", "Rome"],
      "Paris",
      1
    ),
    new Question(
      "Who created JavaScript?",
      ["Plato", "Brendan Eich", "Lea Verou", "Bill Gates"],
      "Brendan Eich",
      2
    ),
    new Question(
      "What is the mass–energy equivalence equation?",
      ["E = mc^2", "E = m*c^2", "E = m*c^3", "E = m*c"],
      "E = mc^2",
      3
    ),
    new Question(
      "Where is Joshua currently located?",
      ["USA", "America", "Texas", "Conroe", "Joshualand", "Emidio's basement"],
      "Emidio's basement",
      4
    ),

    new Question(
      "Whats Joshua Favorite Food?",
      ["Sushi", "Pizza", "Tacos", "Raising Canes"],
      "Raising Canes",
      4
    ),
    // Add more questions here
  ];
  const quizDuration = 120; // 120 seconds (2 minutes)

  /************  QUIZ INSTANCE  ************/

  // Create a new Quiz instance object
  const quiz = new Quiz(questions, quizDuration, quizDuration);
  // Shuffle the quiz questions
  quiz.shuffleQuestions();

  /************  SHOW INITIAL CONTENT  ************/

  // Convert the time remaining in seconds to minutes and seconds, and pad the numbers with zeros if needed
  const minutes = Math.floor(quiz.timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");

  // Display the time remaining in the time remaining container
  const timeRemainingContainer = document.getElementById("timeRemaining");
  timeRemainingContainer.innerText = `${minutes}:${seconds}`;

  // Show first question
  showQuestion();

  /************  TIMER  ************/
  timer = setInterval(() => {
    quiz.timeRemaining--;

    const minutes = Math.floor(quiz.timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");

    const timeRemainingContainer = document.getElementById("timeRemaining");
    timeRemainingContainer.innerText = `${minutes}:${seconds}`;

    if (quiz.timeRemaining <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);

  /************  EVENT LISTENERS  ************/

  nextButton.addEventListener("click", nextButtonHandler);

  /************  FUNCTIONS  ************/

  // showQuestion() - Displays the current question and its choices
  // nextButtonHandler() - Handles the click on the next button
  // showResults() - Displays the end view and the quiz results

  function showQuestion() {
    if (quiz.hasEnded()) {
      showResults();
      return;
    }

    // Clear the previous question text and question choices
    questionContainer.innerText = "";
    choiceContainer.innerHTML = "";

    // Get the current question from the quiz by calling the Quiz class method `getQuestion()`
    const question = quiz.getQuestion();
    // Shuffle the choices of the current question by calling the method 'shuffleChoices()' on the question object
    question.shuffleChoices();

    // YOUR CODE HERE:

    // 1. Show the question
    // Update the inner text of the question container element and show the question text
    questionContainer.innerText = question.text;
    // 2. Update the green progress bar
    // Update the green progress bar (div#progressBar) width so that it shows the percentage of questions answered
    const perc = (quiz.currentQuestionIndex / quiz.questions.length) * 100;
    progressBar.style.width = `${perc}%`; // This value is hardcoded as a placeholder

    // questionIndex (current question) / question.length 1 / 10 10% 2/10 20%

    // 3. Update the question count text
    // Update the question count (div#questionCount) show the current question out of total questions

    questionCount.innerText = `${quiz.currentQuestionIndex} of ${quiz.questions.length} `; //  This value is hardcoded as a placeholder

    // 4. Create and display new radio input element with a label for each choice.
    //
    // For each choice create a new radio input with a label, and append it to the choice container.
    // Each choice should be displayed as a radio input element with a label:

    for (let i = 0; i < question.choices.length; i++) {
      const choices = question.choices[i];
      const choiceContainer = document.querySelector("#choices");

      let label = document.createElement("label");

      let radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "choices";
      radio.value = choices;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(choices));

      choiceContainer.appendChild(label);
      choiceContainer.appendChild(document.createElement("br"));
    }
  }

  function nextButtonHandler() {
    const getChoices = document.querySelectorAll('input[name="choices"]');
    let selectedAnswer = null;

    getChoices.forEach((choice) => {
      if (choice.checked) {
        selectedAnswer = choice.value;
      }
    });
    if (selectedAnswer !== null) {
      quiz.checkAnswer(selectedAnswer);
      quiz.moveToNextQuestion();
      showQuestion();
    }
  }

  function showResults() {
    //
    // 1. Hide the quiz view (div#quizView)
    quizView.style.display = "none";

    // 2. Show the end view (div#endView)
    endView.style.display = "flex";

    // 3. Update the result container (div#result) inner text to show the number of correct answers out of total questions
    resultContainer.innerText = `You scored ${quiz.correctAnswers} out of ${quiz.questions.length} correct answers!`; // This value is hardcoded as a placeholder
  }

  resetBtn.addEventListener("click", () => {
    quiz.correctAnswers = 0;
    quiz.currentQuestionIndex = 0;
    clearInterval(timer);
    quiz.timeRemaining = quiz.timeLimit;

    timer = setInterval(() => {
      quiz.timeRemaining--;

      const minutes = Math.floor(quiz.timeRemaining / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");

      const timeRemainingContainer = document.getElementById("timeRemaining");
      timeRemainingContainer.innerText = `${minutes}:${seconds}`;

      if (quiz.timeRemaining <= 0) {
        clearInterval(timer);
        showResults();
      }
    }, 1000);

    quizView.style.display = "flex";
    endView.style.display = "none";
    showQuestion();
  });
});
