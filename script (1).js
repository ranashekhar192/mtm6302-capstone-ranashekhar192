document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const resultMessage = document.getElementById('result-message');
    const resetTallyButton = document.getElementById('reset-tally');

    let correctTally = localStorage.getItem('correctTally') || 0;
    let incorrectTally = localStorage.getItem('incorrectTally') || 0;

    quizForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const difficulty = document.getElementById('difficulty').value;
        const questionData = await fetchQuestion(difficulty);
        displayQuestion(questionData);
    });

    answersElement.addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedAnswer = document.querySelector('input[name="answer"]:checked').value;
        checkAnswer(selectedAnswer);
    });

    resetTallyButton.addEventListener('click', () => {
        correctTally = 0;
        incorrectTally = 0;
        localStorage.setItem('correctTally', correctTally);
        localStorage.setItem('incorrectTally', incorrectTally);
        updateTally();
    });

    function updateTally() {
        document.getElementById('correct-tally').textContent = `Correct: ${correctTally}`;
        document.getElementById('incorrect-tally').textContent = `Incorrect: ${incorrectTally}`;
    }

    async function fetchQuestion(difficulty) {
        const response = await fetch(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty}`);
        const data = await response.json();
        return data.results[0];
    }

    function displayQuestion(questionData) {
        questionElement.textContent = questionData.question;
        answersElement.innerHTML = '';

        questionData.incorrect_answers.forEach((answer, index) => {
            const answerOption = document.createElement('div');
            answerOption.innerHTML = `
                <input type="radio" name="answer" id="answer${index}" value="${answer}">
                <label for="answer${index}">${answer}</label>
            `;
            answersElement.appendChild(answerOption);
        });

        const correctAnswerIndex = questionData.incorrect_answers.length;
        const correctAnswerOption = document.createElement('div');
        correctAnswerOption.innerHTML = `
            <input type="radio" name="answer" id="answer${correctAnswerIndex}" value="${questionData.correct_answer}">
            <label for="answer${correctAnswerIndex}">${questionData.correct_answer}</label>
        `;
        answersElement.appendChild(correctAnswerOption);

        questionContainer.classList.remove('hidden');
    }

    function checkAnswer(selectedAnswer) {
        const correctAnswer = document.querySelector('input[name="answer"]:checked').value;

        if (selectedAnswer === correctAnswer) {
            correctTally++;
            resultMessage.textContent = 'Correct!';
            resultMessage.style.color = 'Green';
        } else {
            incorrectTally++;
            resultMessage.textContent = 'Incorrect!';
            resultMessage.style.color = 'red';
        }

        localStorage.setItem('correctTally', correctTally);
        localStorage.setItem('incorrectTally', incorrectTally);

        updateTally();
    }

    updateTally();
});
