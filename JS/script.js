"use strict"


// Spollers collection
const spollersArray = document.querySelectorAll("[data-spollers]");

//  Получаем массив обычных спойлеров
if (spollersArray.length > 0) {

    //  Получение обычных спойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
    });
    console.log(`слайдеры без условий; ${Array.isArray(spollersRegular)}`);
    //  Проверка на существование спойлеров без усдовия в data-spollers
    //  (Инициализация обычных спойлеров)
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }
    // ==================================================
    // Пролучение саойлеров с медиа запросами
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];
    });

    //  Проверка на существование спойлеров c усдовиями в data-spollers
    //  (Получение спойлеров с медиа запросими)
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");

            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);

        });
        console.log(`слайдеры с условиями; ${breakpointsArray}`);



        // Получаем уникальные брейкпоинты без повторений
        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });
        console.log(`Получаем уникальные брейкпоинты: ${mediaQueries}`);


        // ===============================================
        // Работаем с каждым брейкпоинтом
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            // Объекты с нужным условием
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });
            console.log(spollersArray);

            // Событие
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
            console.log(matchMedia);
        });
    }

    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            console.log(spollersBlock);
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener('click', setSpollerAction);
            }
        });
    }

    // Вывод контента
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');

        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        console.log(spollerTitle.nextElementSibling);
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    console.log(spollerTitle.nextElementSibling);
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });

        }
    }

    function setSpollerAction(e) {
        const el = e.target;
        console.log(el.closest('[data-spoller]'));
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            console.log(spollersBlock);
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            console.log(oneSpoller);
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                console.log(spollerTitle);
                _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }
    function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}

// =============================================

let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        console.log(target.style.transitionDuration);
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.mardinBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transmition-duration');
            target.style.removeProperty('transmition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}
let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.mardinBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        console.log(target.style.transitionDuration);
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transmition-duration');
            target.style.removeProperty('transmition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}

let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}



// =================== Burger =========================


const iconMenu = document.querySelector('.menu__burger');
const menuBlock = document.querySelector('.menu__block');
const menuBody = document.querySelector('.menu__body');

if (iconMenu) {
    iconMenu.addEventListener("click", function (e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBlock.classList.toggle('_active');
    });
}
// Скрытие меню при нажатии на пустое место
menuBody.addEventListener('click', lockMenu);
function lockMenu() {
    if (iconMenu.classList.contains('_active')) {
        document.body.classList.remove('_lock');
        iconMenu.classList.remove('_active');
        menuBlock.classList.remove('_active');
    }
}



// ============== Плавная прокрутка с нужному разделу =====================

const menuLinks = document.querySelectorAll('.menu__item[data-goto]');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener('click', onMenuLinkClick);
    });

    window.addEventListener("scroll", function (event) {
        console.log(scrollY);
    })

    function onMenuLinkClick(e) {
        const menuLink = e.target;

        // Проверка на существовании атрибута и существование класса указанного в дата-атрибуте
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

            console.log(gotoBlockValue);

            // При нажатии в меню ссылки меню закроется и прокрутится к указанной позиции
            if (iconMenu.classList.contains('_active')) {
                lockMenu();
            }

            // прокрутка на нужную позицию
            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth",
            });
            e.preventDefault();
        }
    }
}
