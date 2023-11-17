function resetAllButtonsStyles() {
    const answersButtons = document.querySelectorAll('.answer_item')
    answersButtons.forEach(btn => {
        btn.classList.remove('item_active')
    });
}



window.addEventListener('DOMContentLoaded', async (ctx) => {
    const tg = window.Telegram.WebApp
    tg.expand()
    let userAnswers = {
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        answer5: []
    }
    let questionNumber = 1
    

    /*----------IMPORTS---------*/
    const answerButtons = document.querySelectorAll('.answer_item')
    const firstDisplay = document.querySelector('.qst1_wrapper')
    const secondDisplay = document.querySelector('.qst2_wrapper')
    const thirdDisplay = document.querySelector('.qst3_wrapper')
    const fourthDisplay = document.querySelector('.qst4_wrapper')
    const fifthDisplay = document.querySelector('.qst5_wrapper')
    const nextQuestionButton = document.querySelectorAll('.next_question_button')
    const testPassedButton = document.querySelector('.test_done_button')
    const restartTest = document.querySelector('#restart')
    /*----------IMPORTS---------*/

    answerButtons.forEach(button => {
        button.addEventListener('click', async () => {
            if (questionNumber !== 5) {
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
                if (userAnswers.answer1 !== button.id) {
                    userAnswers.answer1 = button.id
                } else {
                    button.classList.remove('item_active')
                }
            } else if (questionNumber === 2) {
                if (userAnswers.answer2 !== button.id) {
                    userAnswers.answer2 = button.id
                } else {
                    button.classList.remove('item_active')
                }
            } else if (questionNumber === 3) {
                if (userAnswers.answer3 !== button.id) {
                    userAnswers.answer3 = button.id
                } else {
                    button.classList.remove('item_active')
                } 
            } else if (questionNumber === 4) {
                if (userAnswers.answer4 !== button.id) {
                    userAnswers.answer4 = button.id
                } else {
                    button.classList.remove('item_active')
                }
            } else if (questionNumber === 5) {
                const answerId = button.id;

                if (userAnswers.answer5.includes(answerId)) {
                    // Если ответ уже в массиве, удалите его
                    userAnswers.answer5 = userAnswers.answer5.filter(item => item !== answerId);        
                    button.classList.remove('item_active');
                } else {
                    userAnswers.answer5.push(answerId);
                    button.classList.add('item_active');
                }
            }
            /*------------------WRITE ANSWERS--------------*/
        })
    })

    nextQuestionButton.forEach(button => {
        button.addEventListener('click', async () => {
            if (questionNumber === 1 && !userAnswers.answer1) {
                alert("Пожалуйста, выберите ответ перед переходом к следующему вопросу.");
                return;
            } else if (questionNumber === 2 && !userAnswers.answer2) {
                alert("Пожалуйста, выберите ответ перед переходом к следующему вопросу.");
                return;
            } else if (questionNumber === 3 && !userAnswers.answer3) {
                alert("Пожалуйста, выберите ответ перед переходом к следующему вопросу.");
                return;
            } else if (questionNumber === 4 && !userAnswers.answer4) {
                alert("Пожалуйста, выберите ответ перед переходом к следующему вопросу.");
                return;
            } else if (questionNumber === 5 && userAnswers.answer5.length === 0) {
                alert("Пожалуйста, выберите ответ перед переходом к результатам.");
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
    
                const currentDisplay = document.querySelector('.qst3_wrapper')
                const nextDisplay = document.querySelector('.qst4_wrapper')
    
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex'            
            } else if (questionNumber === 5) {
    
                const currentDisplay = document.querySelector('.qst4_wrapper')
                const nextDisplay = document.querySelector('.qst5_wrapper')
    
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex' 
            } else if (questionNumber === 6) {
                let sum = Object.values(userAnswers)
                .flatMap(value => Array.isArray(value) ? value : [value]) // Преобразуем массив в плоский массив
                .map(value => parseInt(value, 10)) // Преобразуем строки в числа
                .reduce((acc, curr) => acc + curr, 0); // Вычисляем сумму
                
                if (sum === 67) {
                    const currentDisplay = document.querySelector('.qst5_wrapper')
                    const nextDisplay = document.querySelector('.success_wrapper')

                    currentDisplay.style.display = 'none'
                    nextDisplay.style.display = 'flex' 
                } else {
                    const currentDisplay = document.querySelector('.qst5_wrapper')
                    const nextDisplay = document.querySelector('.fail_wrapper')

                    currentDisplay.style.display = 'none'
                    nextDisplay.style.display = 'flex' 
                }
            }
        })
    })

    testPassedButton.addEventListener('click', async () => {
        const data = JSON.stringify({
            webAppType: "testOneWebApp",
            testPassed: true
        })
        tg.sendData(data)
    })

    restartTest.addEventListener('click', async () => {
        location.reload()
    })

})