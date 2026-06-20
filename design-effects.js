window.addEventListener('scroll', () => {
    const header = document.getElementById('navbar');
    
    if (window.scrollY > 110) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
window.addEventListener('load', () => {
    const sections = document.querySelectorAll('section');
    const colors = [];

    sections.forEach(section => {
        const bg = getComputedStyle(section).backgroundColor;
        if (bg !== 'rgba(0, 0, 0, 0)') {
            colors.push(bg);
        }
    });

    document.body.style.background = `linear-gradient(to bottom, ${colors.join(', ')})`;
    document.body.style.backgroundAttachment = 'fixed';

    sections.forEach(section => {
        section.style.background = 'transparent';
    });
});

//popup
const openBtn = document.querySelectorAll(".openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openBtn.forEach(button => {
    button.addEventListener('click', () => {
        modal.classList.add('open');
    });
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

//carousel
const track = document.getElementById('carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const dotsContainer = document.getElementById('carousel-dots');

let currentIndex = 0;

// create dots dynamically based on number of slides
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;   // loops back to 0
    goToSlide(currentIndex);
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;   // loops to last
    goToSlide(currentIndex);
});

// auto-play every 4 seconds
setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
}, 4000);


/*
const popupTriggers = document.querySelectorAll('.popup-trigger');
const popupModal = document.getElementById('popup-modal');
const popupClose = document.getElementById('popup-close');

popupTriggers.forEach(item => {
    item.addEventListener('click', () => {
        document.getElementById('popup-img').src = item.getAttribute('src');
        document.getElementById('popup-img').alt = item.getAttribute('alt');
        document.getElementById('popup-name').textContent = item.dataset.name;
        document.getElementById('popup-description').textContent = item.dataset.description;
        document.getElementById('popup-origin').textContent = item.dataset.origin;
        document.getElementById('popup-price').textContent = item.dataset.price;

        popupModal.showModal();
    });
});

popupClose.addEventListener('click', () => {
    popupModal.close();
});

popupModal.addEventListener('click', (e) => {
    const rect = popupModal.getBoundingClientRect();
    const clickedOutside =
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top || e.clientY > rect.bottom;

    if (clickedOutside) {
        popupModal.close();
    }
});*/

/*
const menuItems = document.querySelectorAll('.menu-item')
const popupOverlay = document.getElementById('popup-overlay');
const popupClose = document.getElementById('popup-close');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // fill popup with data from clicked image
        document.getElementById('popup-img').src = item.src;
        document.getElementById('popup-img').alt = item.alt;
        document.getElementById('popup-name').textContent = item.dataset.name;
        document.getElementById('popup-description').textContent = item.dataset.description;
        document.getElementById('popup-origin').textContent = item.dataset.origin;
        document.getElementById('popup-price').textContent = item.dataset.price;

        // show popup
        popupOverlay.classList.add('active');
    });
});

// close on X button
popupClose.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
});

// close when clicking outside popup
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
    }
});*/