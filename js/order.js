const TOKEN = '6793718495:AAHTN5TuxmYEjXOT9XlyWFQtaxfrRIxBhMM';
const CHAT_ID = '460704399';
const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

// Об'єкт для відповідності ваги та ціни
const PRICES = {
    "5": "1249 грн",
    "10": "1860 грн",
    "15": "2880 грн",
    "20": "3400 грн",
    "25": "4200 грн"
};

document.getElementById("order_form").addEventListener("submit", function(event){
    event.preventDefault();

    let formData = new FormData(this);
    let weight = formData.get("weight");
    let price = PRICES[weight] || "Не визначено"; // Отримуємо ціну відповідно до ваги

    let message = `📌 *Нова заявка!*\n\n👤 *Ім'я:* ${formData.get("name")}\n📞 *Телефон:* ${formData.get("phone")}\n📦 *Вага:* ${weight} кг\n💰 *Ціна:* ${price}`;

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