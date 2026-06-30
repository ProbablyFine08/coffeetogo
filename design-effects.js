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

// modal inner elements
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const modalServed = document.getElementById("modal-served")

openBtn.forEach(button => {
    button.addEventListener('click', () => {
        // grab data from the clicked button
        modalImg.src = button.dataset.img;
        modalTitle.textContent = button.dataset.title;
        modalDesc.textContent = button.dataset.description;
        modalPrice.textContent = button.dataset.price;
        modalServed.textContent = button.dataset.served;

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


