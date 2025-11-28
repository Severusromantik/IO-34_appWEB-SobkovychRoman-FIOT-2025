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


/* ===== НОВИЙ КОД: Логіка бургер-меню (Sidebar) ===== */

const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector(".sidebar .close-btn");

// Функція для відкриття/закриття
function toggleSidebar() {
    sidebar.classList.toggle("active");
}

// 1. Відкриття меню по кліку на бургер-іконку
if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar);
}

// 2. Закриття меню по кліку на іконку "X"
if (closeBtn) {
    closeBtn.addEventListener("click", toggleSidebar);
}
// 3. Закриття меню по кліку поза ним (додаємо до body/document)
document.addEventListener("click", (e) => {
    // Якщо клік був на бургері, то ігноруємо, бо він уже його відкрив
    if (e.target.closest('.menu-toggle')) return; 

    // Якщо клік був поза сайдбаром і сайдбар відкритий
    if (sidebar && !sidebar.contains(e.target) && sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});
