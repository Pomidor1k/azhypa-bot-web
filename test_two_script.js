function resetAllButtonsStyles() {
    const answersButtons = document.querySelectorAll('.answer_item')
    answersButtons.forEach(btn => {
        btn.classList.remove('item_active')
    });
}


window.addEventListener('DOMContentLoaded', async () => {
    const tg = window.Telegram.WebApp

    tg.expand()

    const userAnswers = {
        answer1: [],
        answer2: "",
        answer3: [],
    }
    let questionNumber = 1

    /*-----IMPORTS-----*/
    const answerButtons = document.querySelectorAll('.answer_item')
    const nextQuestionButton = document.querySelectorAll('.next_question_button')
    testPassedButton = document.querySelector('.test_done_button')
    const restartTest = document.querySelector('#restart')
    /*-----IMPORTS-----*/


    answerButtons.forEach(button => {
        button.addEventListener('click', async () => {
            if (questionNumber !== 1 && questionNumber !== 3) {
                if (!button.classList.contains('item_active')) {
                    resetAllButtonsStyles();
                    setTimeout(() => {
                        button.classList.add('item_active');
                    }, 50); // задержка в 50 миллисекунд
                } else {
                    button.classList.remove('item_active');
                }  
            }


            /*------------WRITE ANSWERS----------*/
            if (questionNumber === 1) {
                const answerId = button.id;

                if (userAnswers.answer1.includes(answerId)) {
                    // Если ответ уже в массиве, удалите его
                    userAnswers.answer1 = userAnswers.answer1.filter(item => item !== answerId);        
                    button.classList.remove('item_active');
                } else {
                    userAnswers.answer1.push(answerId);
                    button.classList.add('item_active');
                }
            } else if (questionNumber === 2) {
                if (userAnswers.answer2 !== button.id) {
                    userAnswers.answer2 = button.id
                } else {
                    button.classList.remove('item_active')
                }
            } else if (questionNumber === 3) {
                const answerId = button.id;

                if (userAnswers.answer3.includes(answerId)) {
                    // Если ответ уже в массиве, удалите его
                    userAnswers.answer3 = userAnswers.answer3.filter(item => item !== answerId);        
                    button.classList.remove('item_active');
                } else {
                    userAnswers.answer3.push(answerId);
                    button.classList.add('item_active');
                }
            }
            /*------------------WRITE ANSWERS--------------*/
        })
    })



    nextQuestionButton.forEach(button => {
        button.addEventListener('click', async () => {
            if (questionNumber === 1 && userAnswers.answer1.length === 0) {
                alert("Пожалуйста, выберите ответ перед переходом к следующему вопросу.");
                return;
            } else if (questionNumber === 2 && !userAnswers.answer2) {
                alert("Пожалуйста, выберите ответ перед переходом к следующему вопросу.");
                return;
            } else if (questionNumber === 3 && userAnswers.answer3.length === 0) {
                alert("Пожалуйста, выберите ответ перед переходом к следующему вопросу.");
                return;
            }
    
            questionNumber = questionNumber+1
    
    
    
            if (questionNumber === 2) {
    
                const currentDisplay = document.querySelector('.qst1_wrapper')
                const nextDisplay = document.querySelector('.qst2_wrapper')
    
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex'
            } else if (questionNumber === 3) {
    
                const currentDisplay = document.querySelector('.qst2_wrapper')
                const nextDisplay = document.querySelector('.qst3_wrapper')
    
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex'
            } else if (questionNumber === 4) {
                let sum = Object.values(userAnswers)
                .flatMap(value => Array.isArray(value) ? value : [value]) // Преобразуем массив в плоский массив
                .map(value => parseInt(value, 10)) // Преобразуем строки в числа
                .reduce((acc, curr) => acc + curr, 0); // Вычисляем сумму
                
                if (sum === 28) {
                    const currentDisplay = document.querySelector('.qst3_wrapper')
                    const nextDisplay = document.querySelector('.success_wrapper')
        
                    currentDisplay.style.display = 'none'
                    nextDisplay.style.display = 'flex'
                } else {
                    const currentDisplay = document.querySelector('.qst3_wrapper')
                    const nextDisplay = document.querySelector('.fail_wrapper')
        
                    currentDisplay.style.display = 'none'
                    nextDisplay.style.display = 'flex'
                }
            }
        })
    })


    testPassedButton.addEventListener('click', async () => {
        const data = JSON.stringify({
            webAppType: "testTwoWebApp",
            testPassed: true
        })
        tg.sendData(data)
    })

    restartTest.addEventListener('click', async () => {
        location.reload()
    })
})