document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('product-list');
    const filterCategoryLinks = document.querySelectorAll('.filter-category');
    const filterSeasonLinks = document.querySelectorAll('.filter-season');
    const currentFilterTitle = document.getElementById('current-filter-title');

    // =================================================================
    // СТАН ФІЛЬТРАЦІЇ: зберігаємо активні фільтри тут
    // Використовуємо Set для уникнення дублікатів та швидкого пошуку
    // =================================================================
    let currentFilters = {
        categories: new Set(),
        seasons: new Set()
    };

    // =================================================================
    // ФУНКЦІЯ: Читання параметрів із URL та ініціалізація стану
    // =================================================================
    function initializeStateFromUrl() {
        const params = new URLSearchParams(window.location.search);
        
        // Читаємо category (зазвичай man або woman)
        const categoryParam = params.get('category');
        if (categoryParam) {
            currentFilters.categories.add(categoryParam);
        }

        // Читаємо season (зазвичай spring, summer, etc.)
        const seasonParam = params.get('season');
        if (seasonParam) {
            currentFilters.seasons.add(seasonParam);
        }
    }

    // =================================================================
    // ФУНКЦІЯ: Завантаження даних із JSON
    // =================================================================
    async function fetchProducts() {
        try {
            const response = await fetch('shoes.json'); 
            if (!response.ok) {
                throw new Error('Помилка завантаження даних про товари.');
            }
            return await response.json();
        } catch (error) {
            console.error('Помилка при отриманні товарів:', error);
            productListContainer.innerHTML = '<p>На жаль, не вдалося завантажити товари.</p>';
            return [];
        }
    }

    // =================================================================
    // ФУНКЦІЯ: Створення HTML-картки (без змін)
    // =================================================================
    function createProductCard(product) {
        const card = document.createElement('a');
        card.href = `product.html?id=${product.id}`; 
        card.className = 'product-card';

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-brand">${product.brand}</span>
                <span class="product-name">${product.name}</span>
                <span class="product-price">$${product.price.toFixed(2)}</span>
            </div>
        `;
        return card;
    }

    // =================================================================
    // ФУНКЦІЯ: Оновлення активного класу для виділення фільтрів
    // =================================================================
    function updateActiveFilterUI() {
        // Прибираємо активний клас з усіх посилань
        document.querySelectorAll('.nav-links a, .sidebar-nav-links a').forEach(link => {
            link.classList.remove('active-filter');
        });

        // Активуємо обрані категорії
        currentFilters.categories.forEach(cat => {
            document.querySelectorAll(`a.filter-category[data-category="${cat}"]`).forEach(link => {
                link.classList.add('active-filter');
            });
        });

        // Активуємо обрані сезони
        currentFilters.seasons.forEach(s => {
            document.querySelectorAll(`a.filter-season[data-season="${s}"]`).forEach(link => {
                link.classList.add('active-filter');
            });
        });
    }


    // =================================================================
    // ОСНОВНА ФУНКЦІЯ: Рендеринг та Мультифільтрація
    // =================================================================
    async function renderProducts() {
        const allProducts = await fetchProducts();
        const activeCategories = Array.from(currentFilters.categories);
        const activeSeasons = Array.from(currentFilters.seasons);

        let filteredProducts = allProducts;
        let titleParts = [];
        
        // 1. Фільтрація за категорією (man/woman)
        if (activeCategories.length > 0) {
            // Фільтруємо продукти, які належать хоча б до однієї з обраних категорій
            filteredProducts = filteredProducts.filter(product => 
                activeCategories.includes(product.category)
            );
            
            const categoryNames = activeCategories.map(c => c === 'woman' ? 'жіноче' : 'чоловіче').join(' та ');
            titleParts.push(categoryNames);
        }

        // 2. Фільтрація за сезоном
        if (activeSeasons.length > 0) {
            // Фільтруємо продукти, які належать хоча б до одного з обраних сезонів
            filteredProducts = filteredProducts.filter(product => {
                return product.season.some(s => activeSeasons.includes(s));
            });
            
            const seasonMap = {
                'spring': 'весняне', 'summer': 'літнє', 'autumn': 'осіннє', 'winter': 'зимове'
            };
            const seasonNames = activeSeasons.map(s => seasonMap[s]).join(' та ');
            titleParts.push(seasonNames);
        }
        
        // Формуємо заголовок
        if (titleParts.length === 2) {
            currentFilterTitle.textContent = `Взуття: ${titleParts[0]} та ${titleParts[1]}`;
        } else if (titleParts.length === 1) {
            currentFilterTitle.textContent = `Взуття: ${titleParts[0]}`;
        } else {
            currentFilterTitle.textContent = 'Всі товари';
        }
        
        // Відображення товарів
        productListContainer.innerHTML = '';
        if (filteredProducts.length === 0) {
            productListContainer.innerHTML = '<p style="text-align:center; width: 100%; font-size: 1.2rem; margin-top: 50px;">На жаль, товарів за обраними фільтрами не знайдено.</p>';
        } else {
            filteredProducts.forEach(product => {
                productListContainer.appendChild(createProductCard(product));
            });
        }
        
        // Оновлюємо UI активних посилань
        updateActiveFilterUI();
    }

    // =================================================================
    // ОБРОБНИКИ ПОДІЙ ДЛЯ ФІЛЬТРІВ (Toggle-логіка)
    // =================================================================
    
    // Обробники для категорій (Жіноче, Чоловіче)
    filterCategoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.currentTarget.dataset.category;
            
            // Toggle-логіка: якщо вже є, видаляємо; якщо немає, додаємо
            if (currentFilters.categories.has(category)) {
                currentFilters.categories.delete(category);
            } else {
                currentFilters.categories.add(category);
            }
            
            renderProducts(); 
        });
    });

    // Обробники для сезонів
    filterSeasonLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const season = e.currentTarget.dataset.season;
            
            // Toggle-логіка
            if (currentFilters.seasons.has(season)) {
                currentFilters.seasons.delete(season);
            } else {
                currentFilters.seasons.add(season);
            }

            renderProducts(); 
        });
    });

    // =================================================================
    // ПОЧАТКОВИЙ ЗАПУСК при завантаженні сторінки
    // =================================================================
    
    // 1. Ініціалізуємо стан фільтрами з URL (якщо вони є)
    initializeStateFromUrl();

    // 2. Запускаємо рендеринг
    renderProducts();
});