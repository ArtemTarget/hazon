// ✅ Дані для відправки в Telegram
const TOKEN = '6793718495:AAHTN5TuxmYEjXOT9XlyWFQtaxfrRIxBhMM';
const CHAT_ID = '460704399';
const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

// ✅ Об’єкт для відповідності ваги та ціни
const PRICES = {
    "5": "1249 грн",
    "10": "1860 грн",
    "15": "2880 грн",
    "20": "3400 грн",
    "25": "4200 грн"
};

// ✅ Функція для запуску таймера
function startCountdown() {
    function getTimeUntilNext5AM() {
        let now = new Date();
        let next5AM = new Date();
        next5AM.setHours(5, 0, 0, 0); // Встановлюємо 5:00 ранку

        if (now.getHours() >= 5) {
            next5AM.setDate(next5AM.getDate() + 1);
        }

        return Math.floor((next5AM - now) / 1000); // Час у секундах
    }

    let countdownTime = getTimeUntilNext5AM();

    function updateTimer() {
        let hours = Math.floor(countdownTime / 3600);
        let minutes = Math.floor((countdownTime % 3600) / 60);
        let seconds = countdownTime % 60;

        document.querySelectorAll(".hours").forEach(el => el.innerHTML = `<span>${Math.floor(hours / 10)}</span><span>${hours % 10}</span>`);
        document.querySelectorAll(".minutes").forEach(el => el.innerHTML = `<span>${Math.floor(minutes / 10)}</span><span>${minutes % 10}</span>`);
        document.querySelectorAll(".seconds").forEach(el => el.innerHTML = `<span>${Math.floor(seconds / 10)}</span><span>${seconds % 10}</span>`);

        if (countdownTime > 0) {
            countdownTime--;
            setTimeout(updateTimer, 1000);
        } else {
            document.querySelector(".timer_block p").textContent = "Пропозиція завершена!";
            document.querySelector(".timer").innerHTML = "<p>Акція завершена!</p>";
        }
    }

    updateTimer();
}


document.addEventListener("DOMContentLoaded", function () {
    startCountdown(); // Запускаємо таймер

    const orderForm = document.getElementById("order_form");

    if (orderForm) {
        orderForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Забороняємо стандартну відправку форми

            // Отримуємо дані з форми
            let formData = new FormData(this);
            let name = formData.get("name")?.trim();
            let phone = formData.get("phone")?.trim();
            let honeypot = formData.get("honeypot")?.trim();
            let weight = formData.get("weight");
            let price = PRICES[weight] || "Не визначено";

            // Перевірка імені (мінімум 3 літери, тільки букви)
            if (!/^[A-Za-zА-Яа-яЇїІіЄєҐґ]{3,}$/.test(name)) {
                alert("Ім'я має містити мінімум 3 літери та тільки букви!");
                return;
            }

            // Перевірка телефону (коректний формат + заборона однакових цифр, типу 1111111111)
            if (!/^\+?[0-9]{10,15}$/.test(phone) || /^(\d)\1+$/.test(phone)) {
                alert("Введіть коректний номер телефону!");
                return;
            }

            // Перевірка Honeypot (захист від ботів)
            if (honeypot) {
                alert("Заповнено приховане поле, ймовірно це бот!");
                return;
            }

            // Формування повідомлення для Telegram
            let message = `📌 *Нова заявка!*\n\n👤 *Ім'я:* ${name}\n📞 *Телефон:* ${phone}\n📦 *Вага:* ${weight} кг\n💰 *Ціна:* ${price}`;

            // Відправка запиту в Telegram API
            fetch(URL_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "Markdown"
                })
            }).then(response => response.json())
            .then(data => {
                if (data.ok) {
                    window.location.href = 'success.html'; // ✅ Перенаправлення після успіху
                } else {
                    alert("❌ Помилка при відправці заявки: " + data.description);
                }
            }).catch(error => {
                console.error("❌ Fetch помилка:", error);
                alert("Сталася помилка при відправці форми. Спробуйте ще раз.");
            });
        });
    } else {
        console.error("❌ Форма не знайдена!");
    }
});
