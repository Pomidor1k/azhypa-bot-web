const express = require('express');
const path = require('path'); // Добавлено для работы с путями
var admin = require("firebase-admin");

/*------------------INITIALIZING-------------*/
var serviceAccount = require("./serviceAccountKeys.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const app = express();

app.use(express.static(path.join(__dirname, '')));
 // Указываем корень для статических файлов
app.use(express.json());

/*-----------------PAGES ROUTES---------------*/
app.get('/payment_check_page', (req, res) => {
    // Загружаем файл test_one.html
    res.sendFile(__dirname + '/payment_check_page.html');
});

app.get('/test_one', (req, res) => {
    // Загружаем файл test_one.html
    res.sendFile(__dirname + '/test_one.html');
});

app.get('/test_two', (req, res) => {
    // Загружаем файл test_one.html
    res.sendFile(__dirname + '/test_two.html');
});

app.get('/upgrade_adv_pro_check', (req, res) => {
    // Загружаем файл test_one.html
    res.sendFile(__dirname + '/upgrade_adv_pro_check.html');
});

app.get('/session_sign_up', (req, res) => {
    // Загружаем файл test_one.html
    res.sendFile(__dirname + '/session_sign_up.html');
});

app.get('/upgrade_bas_adv_check', (req, res) => {
    // Загружаем файл test_one.html
    res.sendFile(__dirname + '/upgrade_bas_adv_check.html');
});

app.get('/upgrade_bas_pro_check', (req, res) => {
    // Загружаем файл test_one.html
    res.sendFile(__dirname + '/upgrade_bas_pro_check.html');
});

app.get('/video1/:userId', async (req, res) => {
    const user = await db.collection("users").doc(req.params.userId).get();
    if (user.exists) {
        res.sendFile(__dirname + "/video_one.html");
    } else {
        res.status(404).send("User not found");
    }
});

/*--------------PAYMENT CHECK PAGE---------------*/
app.post("/check-user-primary-payment", async (req, res) => {
    const { userEmail } = req.body
    const clearedEmail = userEmail.toLowerCase().trim();

    await findUserPrimaryPayment(clearedEmail)
    .then(data => {
        if (data.error) {
            res.send({
                data: "error"
            })
        } else {
            res.send({
                data: {
                    result: "success",
                    userEmail: clearedEmail,
                    userPhone: data.userPhone,
                    userName: data.userName,
                    paymentPrice: data.paymentPrice
                }
            })
        }
    })
})


/*----------FUNCTION TO FIND USER IN PAYMENT KEYS-------*/
//returns all fields if true OR false 
async function findUserPrimaryPayment(userEmail) {
    const db = admin.firestore();

    try {
        // Получаем данные из коллекции paymentKeys
        const snapshot = await db.collection('paymentKeys').doc(userEmail).get();

        // Проверяем, существует ли документ с указанным userEmail
        if (snapshot.exists) {
            // Возвращаем все поля и значения данного документа
            return snapshot.data();
        } else {
            // Если документ не найден, возвращаем соответствующее сообщение или значение
            return {
                error: 'Документ не найден'
            };
        }
    } catch (error) {
        // Обработка ошибок, если что-то пошло не так
        console.error('Ошибка при получении данных из БД:', error);
        return {
            error: 'Произошла ошибка при получении данных из БД'
        };
    }
}
/*----------FUNCTION TO FIND USER IN PAYMENT KEYS-------*/

/*--------------PAYMENT CHECK PAGE---------------*/


/*------------WEBHOOK------------*/
app.post('/webhook', async (req, res) => {
    const webhookKeyFromHeaders = req.headers['webhook-key'];
  
    if (webhookKeyFromHeaders !== "9187CC74AD93C42A2A101E147095919A093F07CE334638BABBD620B21F089A46") {
      console.error("Invalid webhook key.");
      return res.status(401).send("Invalid webhook key.");
    } else {
      const webhookData = req.body;
      console.log(webhookData);
      console.log("-----------------");
      const userName = webhookData.customer_name
      const userPhone = webhookData.customer_phone
      const userEmail = webhookData.customer_email
      console.log(userEmail);
      const paymentPrice = webhookData.total_amount
  
      await addUserAfterPaymentToFirestore(`${userEmail}`, `${userName}`, `${userPhone}`, `${paymentPrice}`)
  
  
      res.status(200).send("Webhook processed successfully.");
    }
});
/*------------WEBHOOK------------*/
//add user to firestore after payment
async function addUserAfterPaymentToFirestore(userEmail, userName, userPhone, paymentPrice) {
    const db = admin.firestore();
  
    try {
      // Создаем документ с названием userEmail
      const userDocRef = db.collection('paymentKeys').doc(userEmail);
  
      // Добавляем поля в документ
      await userDocRef.set({
        userName: userName,
        userPhone: userPhone,
        paymentPrice: paymentPrice,
      });
  
      console.log(`Пользователь успешно добавлен в Firestore: ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Ошибка при добавлении пользователя в Firestore:', error);
      return false;
    }
}


app.post("/getUserRateForVideo", (req, res) => {
    const { userId } = req.body

    const userRate = getUserRate(`${userId}`)
    res.send({
        data: userRate
    })
})



app.get("/video2/:userId", async (req, res) => {
    const user = await db.collection("users").doc(req.params.userId).get();
    if (user.exists) {
        res.sendFile(__dirname + "/video_two.html");
    } else {
        res.status(404).send("User not found");
    }
});

app.get("/video3/:userId", async (req, res) => {
    const user = await db.collection("users").doc(req.params.userId).get();
    if (user.exists) {
        res.sendFile(__dirname + "/video_three.html");
    } else {
        res.status(404).send("User not found");
    }
  });
  
  app.get("/video4BA/:userId", async (req, res) => {
    const user = await db.collection("users").doc(req.params.userId).get();
    if (user.exists) {
      res.sendFile(__dirname + '/video_four_B_A.html');
    } else {
        res.status(404).send("User not found");
    }
  });
  
  app.get("/video4BP/:userId", async (req, res) => {
    const user = await db.collection("users").doc(req.params.userId).get();
    if (user.exists) {
      res.sendFile(__dirname + '/video_four_B_P.html');
    } else {
        res.status(404).send("User not found");
    }
  });





async function getUserRate(userId) {
    try {
      const db = admin.firestore();
      const usersRef = db.collection('users');
      
      // Получаем документ по userId
      const userDoc = await usersRef.doc(String(userId)).get();
  
      // Проверяем, существует ли пользователь с данным userId
      if (!userDoc.exists) {
        console.log(`Пользователь с userId ${userId} не найден`);
        return null;
      }
  
      // Получаем значение поля userRate
      const userRate = userDoc.data().userRate;
  
      console.log(`Значение userRate для пользователя с userId ${userId}: ${userRate}`);
      return userRate;
    } catch (error) {
      console.error('Ошибка при получении значения userRate:', error);
      throw error;
    }
}


/*--------------------------STARTING SERVER---------------------------*/
app.listen(3000, () => {
    console.log('Приложение запущено на порту 3000');
});
