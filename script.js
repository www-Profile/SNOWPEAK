// ===================================
// НАВИГАЦИЯ И МЕНЮ
// ===================================

// Эффект при скролле
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Мобильное меню
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

if (burger) {
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('toggle');
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// Подсветка активного пункта меню
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// ПОГОДА
// ===================================

async function getRealWeather() {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;
    
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Sochi&units=metric&appid=4d8fb5b93d4af21d66a4b1f3638e5dc4');
        const data = await response.json();
        
        if (data.main) {
            const temp = Math.round(data.main.temp);
            const condition = data.weather[0].description;
            const icon = getWeatherIcon(data.weather[0].main);
            
            weatherWidget.innerHTML = `
                <div class="weather-temp">${temp}°C</div>
                <div class="weather-condition">${icon} ${condition}</div>
                <div class="weather-snow">❄️ Снежный покров: 120см</div>
            `;
        }
    } catch (error) {
        console.log('Ошибка погоды, показываем тестовые данные');
        weatherWidget.innerHTML = `
            <div class="weather-temp">-8°C</div>
            <div class="weather-condition">❄️ Снегопад</div>
            <div class="weather-snow">❄️ Снежный покров: 120см</div>
        `;
    }
}

function getWeatherIcon(weather) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Drizzle': '🌦️',
        'Mist': '🌫️'
    };
    return icons[weather] || '☁️';
}

// ===================================
// МОДАЛЬНОЕ ОКНО ДЛЯ ТРАСС
// ===================================

const trailModal = document.getElementById('trailModal');
const modalClose = document.querySelector('.trail-modal-close');

const trailData = {
    forest: {
        name: 'Лесная',
        difficulty: 'Зеленая',
        difficultyClass: 'green',
        length: '2.5 км',
        drop: '200 м',
        time: '15 мин',
        steepness: '15°',
        description: 'Идеальная трасса для начинающих. Широкий ровный склон, пологие спуски, отличная подготовка. Рекомендуется для первого самостоятельного катания и обучения с инструктором.',
        features: [
            'Искусственное оснежение',
            'Ночное освещение',
            'Видеонаблюдение',
            'Спасательная служба',
            'Бесплатный вай-фай',
            'Кафе на трассе'
        ]
    },
    peak: {
        name: 'Вершина',
        difficulty: 'Синяя',
        difficultyClass: 'blue',
        length: '3.2 км',
        drop: '450 м',
        time: '20 мин',
        steepness: '25°',
        description: 'Самая живописная трасса курорта. Проходит через альпийские луга и хвойный лес. Открываются потрясающие виды.',
        features: [
            'Искусственное оснежение',
            'Ночное освещение',
            'Панорамные виды',
            'Фотозоны',
            'Спасательная служба',
            'Подъемник 6 кресел'
        ]
    },
    extreme: {
        name: 'Экстрим',
        difficulty: 'Красная',
        difficultyClass: 'red',
        length: '2.8 км',
        drop: '580 м',
        time: '18 мин',
        steepness: '35°',
        description: 'Трасса для уверенных райдеров. Включает крутые спуски и узкие участки. Требуется хорошая физическая подготовка.',
        features: [
            'Искусственное оснежение',
            'Ночное освещение',
            'Freeride зоны',
            'Спасательная служба',
            'Ski patrol',
            'Метеостанция'
        ]
    },
    dragon: {
        name: 'Черный дракон',
        difficulty: 'Черная',
        difficultyClass: 'black',
        length: '1.9 км',
        drop: '620 м',
        time: '12 мин',
        steepness: '45°',
        description: 'Экстремальная трасса для профессионалов. Только для опытных райдеров! Обязательно использование защиты.',
        features: [
            'Естественный рельеф',
            'Freeride зона',
            'Спасательная служба',
            'Видеонаблюдение',
            'Ski patrol',
            'Пункт первой помощи'
        ]
    }
};

if (document.querySelectorAll('.card').length > 0) {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const trailId = this.dataset.trail;
            const trail = trailData[trailId];
            
            if (trail && trailModal) {
                document.getElementById('modalTrailName').textContent = trail.name;
                document.getElementById('modalTrailDifficulty').textContent = trail.difficulty;
                document.getElementById('modalTrailDifficulty').className = `trail-modal-badge ${trail.difficultyClass}`;
                document.getElementById('modalTrailLength').textContent = trail.length;
                document.getElementById('modalTrailDrop').textContent = trail.drop;
                document.getElementById('modalTrailTime').textContent = trail.time;
                document.getElementById('modalTrailSteepness').textContent = trail.steepness;
                document.getElementById('modalTrailDescription').textContent = trail.description;
                
                const featuresList = document.getElementById('modalTrailFeatures');
                if (featuresList) {
                    featuresList.innerHTML = '';
                    trail.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = '✓ ' + feature;
                        featuresList.appendChild(li);
                    });
                }
                
                trailModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        trailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// ===================================
// МОДАЛЬНОЕ ОКНО ДЛЯ ПРОЖИВАНИЯ
// ===================================

const accommodationModal = document.getElementById('accommodationModal');

const accommodationData = {
    hotel: {
        name: 'Отель "Вершина"',
        rating: '4.8',
        rooms: '45 номеров',
        meal: 'Завтрак шведский стол',
        capacity: '2-4 человека',
        price: 'от 5 500 ₽/ночь',
        description: 'Современный отель премиум-класса в 50 метрах от подъемника.',
        features: [
            'Бесплатный Wi-Fi',
            'Парковка',
            'Ресторан',
            'СПА-центр',
            'Тренажерный зал',
            'Консьерж 24/7'
        ]
    },
    chalet: {
        name: 'Шале "Лесное"',
        rating: '4.9',
        rooms: '8 шале',
        meal: 'Ресторан доставка',
        capacity: '4-8 человек',
        price: 'от 8 500 ₽/ночь',
        description: 'Отдельные деревянные шале в сосновом лесу. Каждый дом с камином.',
        features: [
            'Камин',
            'Сауна',
            'Терраса',
            'Барбекю',
            'Кухня',
            'Трансфер до склона'
        ]
    },
    apart: {
        name: 'Апартаменты "Снежинка"',
        rating: '4.5',
        rooms: '24 апартаментов',
        meal: 'Кухня в номере',
        capacity: '2-6 человек',
        price: 'от 3 200 ₽/ночь',
        description: 'Уютные апартаменты студийного типа с кухней.',
        features: [
            'Кухня',
            'Холодильник',
            'Телевизор',
            'Балкон',
            'Парковка',
            'Стиральная машина'
        ]
    },
    vip: {
        name: 'VIP-резиденция',
        rating: '5.0',
        rooms: '3 резиденции',
        meal: 'Личный повар',
        capacity: '8-12 человек',
        price: 'от 25 000 ₽/ночь',
        description: 'Эксклюзивные резиденции с прямым выходом на склон.',
        features: [
            'Личный повар',
            'Дворецкий',
            'Кинозал',
            'Джакузи',
            'Винный погреб',
            'Ski-in/Ski-out'
        ]
    }
};

if (document.querySelectorAll('.accommodation-card').length > 0) {
    document.querySelectorAll('.accommodation-card').forEach(card => {
        card.addEventListener('click', function() {
            const accId = this.dataset.accommodation;
            const acc = accommodationData[accId];
            
            if (acc && accommodationModal) {
                document.getElementById('modalAccommodationName').textContent = acc.name;
                document.getElementById('modalAccommodationRating').textContent = acc.rating;
                document.getElementById('modalAccommodationRooms').textContent = acc.rooms;
                document.getElementById('modalAccommodationMeal').textContent = acc.meal;
                document.getElementById('modalAccommodationCapacity').textContent = acc.capacity;
                document.getElementById('modalAccommodationPrice').textContent = acc.price;
                document.getElementById('modalAccommodationDescription').textContent = acc.description;
                
                const featuresList = document.getElementById('modalAccommodationFeatures');
                if (featuresList) {
                    featuresList.innerHTML = '';
                    acc.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = '✓ ' + feature;
                        featuresList.appendChild(li);
                    });
                }
                
                accommodationModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

function closeAccommodationModal() {
    if (accommodationModal) {
        accommodationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===================================
// ОБЩИЕ ФУНКЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН
// ===================================

window.addEventListener('click', (event) => {
    if (event.target === trailModal) {
        trailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (event.target === accommodationModal) {
        closeAccommodationModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (trailModal && trailModal.style.display === 'block') {
            trailModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (accommodationModal && accommodationModal.style.display === 'block') {
            closeAccommodationModal();
        }
    }
});

// ===================================
// АНИМАЦИЯ ПРИ СКРОЛЛЕ
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .rental-card, .pass-card, .about-content, .contact-info, .rule-card, .accommodation-card, .event-card, .review-card, .schedule-card, .news-card').forEach(el => {
    if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    }
});

// ===================================
// СНЕЖИНКИ
// ===================================

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '❄️';
    snowflake.style.position = 'fixed';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.top = '-20px';
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    snowflake.style.opacity = Math.random() * 0.3 + 0.1;
    snowflake.style.zIndex = '9999';
    snowflake.style.pointerEvents = 'none';
    snowflake.style.userSelect = 'none';
    snowflake.style.filter = 'blur(0.5px)';
    snowflake.style.animation = `snowfall ${Math.random() * 5 + 8}s linear forwards`;
    
    document.body.appendChild(snowflake);
    
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.remove();
        }
    }, 13000);
}

if (!document.querySelector('#snow-style')) {
    const style = document.createElement('style');
    style.id = 'snow-style';
    style.textContent = `
        @keyframes snowfall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

if (window.innerWidth > 768) {
    setInterval(createSnowflake, 500);
}

// ===================================
// ФОРМЫ
// ===================================

const onlineBooking = document.getElementById('onlineBooking');
if (onlineBooking) {
    onlineBooking.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо за бронирование! Мы свяжемся с вами в ближайшее время.');
        onlineBooking.reset();
    });
}

// ===================================
// ПАРАЛЛАКС ЭФФЕКТ
// ===================================

document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        hero.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
    }
});

// ===================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease';
    }
});

// ===================================
// ПОКАЗ ПОЛЕЙ ДЛЯ ПРАЗДНИКА
// ===================================

const eventSelect = document.getElementById('eventSelect');
const eventDetails = document.getElementById('eventDetails');

if (eventSelect && eventDetails) {
    eventSelect.addEventListener('change', function() {
        eventDetails.style.display = this.value ? 'block' : 'none';
        if (this.value) {
            eventDetails.style.animation = 'fadeIn 0.3s ease';
        }
    });
}

// Добавляем анимацию если еще нет
if (!document.querySelector('#fadein-style')) {
    const style = document.createElement('style');
    style.id = 'fadein-style';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}