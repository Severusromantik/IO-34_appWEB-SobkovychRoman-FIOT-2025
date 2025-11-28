/* ===== Випадаючий список для Мови та Міст ===== */

// Отримуємо ВСІ елементи з класом 'select-menu'
const selectMenus = document.querySelectorAll(".select-menu");

selectMenus.forEach(optionMenu => {
    
    const selectBtn = optionMenu.querySelector(".select-button");
    const options = optionMenu.querySelectorAll(".option");
    
    // Встановлюємо змінну для тексту кнопки, використовуючи різні класи для Мови/Міст
    let buttonTextElement;
    
    if (optionMenu.querySelector(".sLngBtn-text")) {
        buttonTextElement = optionMenu.querySelector(".sLngBtn-text");
    } else if (optionMenu.querySelector(".sTwnBtn-text")) {
        buttonTextElement = optionMenu.querySelector(".sTwnBtn-text");
    }

    // 1. Обробник для кнопки: перемикає клас 'active'
    selectBtn.addEventListener("click", (e) => {
        // Запобігаємо спливанню події, щоб не закрити меню відразу
        e.stopPropagation(); 
        
        // Закриваємо всі інші відкриті меню
        document.querySelectorAll(".select-menu.active").forEach(otherMenu => {
            if (otherMenu !== optionMenu) {
                otherMenu.classList.remove("active");
            }
        });

        // Відкриваємо/закриваємо поточне меню
        optionMenu.classList.toggle("active");
    });

    // 2. Обробник для вибору опції: 
    options.forEach(option => {
        option.addEventListener("click", () => {
            let selectedOption = option.querySelector(".option-text").innerText;
            
            // Змінюємо текст кнопки, якщо елемент знайдено
            if (buttonTextElement) {
                 buttonTextElement.innerText = selectedOption;
            }
            
            // Закриваємо меню після вибору
            optionMenu.classList.remove("active");
        });
    });
    
    // 3. Обробник для кліку поза меню (закриває меню)
    document.addEventListener("click", (e) => {
        if (!optionMenu.contains(e.target)) {
            optionMenu.classList.remove("active");
        }
    });
});