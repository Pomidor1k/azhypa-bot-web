window.addEventListener('DOMContentLoaded', async () => {

    const input = document.querySelector('.check_email')
    const checkTitle = document.querySelector('.title')
    const errorTitle = document.querySelector('.error_title')

    const tg = window.Telegram.WebApp
    if (tg.platform === 'tdesktop') {
        tg.MainButton.show()
    }
    tg.expand()
    tg.MainButton.text = 'Проверить'

    /*-------BLUR INPUT FOCUS------*/
    document.addEventListener('click', function(event) {
        // Проверяем, не является ли целью события элементом внутри инпута
        if (!input.contains(event.target)) {
          // Если не является, убираем фокус с инпута
          input.blur();
        }
      });
    /*-------BLUR INPUT FOCUS------*/

    /*-------FOLLOW INPUT TEXT------*/
    input.addEventListener('input', function(event) {
        tg.MainButton.show()
        const inputValue = event.target.value;
        if (inputValue.length === 0) {
            tg.MainButton.hide()
        }
      });
    /*-------FOLLOW INPUT TEXT------*/



    /*----MAIN BUTTON CLICK HANDLER(FETCH TO CHECK PAYMENT)---*/
    Telegram.WebApp.onEvent('mainButtonClicked', async () => {
        const inputValue = input.value;
        await fetch("/check-user-primary-payment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: inputValue
            })
        }) 
        .then(response => response.json())
        .then(data => {
            if (data.data === 'error') {
                tg.HapticFeedback.notificationOccurred('error')
                checkTitle.classList.remove('animated-element');
                checkTitle.style.display = 'none'
                errorTitle.classList.add('animated-element');
                errorTitle.style.display = 'block'
            } else {                
                const dataToSend = JSON.stringify({
                    webAppType: "checkPaymentWebApp",
                    userEmail: data.data.userEmail,
                    userPhone: data.data.userPhone,
                    userName: data.data.userName,
                    paymentPrice: data.data.paymentPrice
                })

                tg.sendData(dataToSend)

                Telegram.WebApp.onEvent('mainButtonClicked', async () => {
                    tg.HapticFeedback.notificationOccurred('success')
                    tg.close()
                })
            }
        })
    })
     /*----MAIN BUTTON CLICK HANDLER(FETCH TO CHECK PAYMENT)---*/
})