const sliderList = document.querySelector(".slider-list");
const slides = document.querySelectorAll(".slider");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const pauseButton = document.querySelector(".pause");
const indicators = document.querySelectorAll(".indicator");
const interval = 3000;
let autoSlide;
let currentIndex = 0;
let paused = false;
let startX = undefined;
let startY = undefined;

function moveSlider(index) {
    const slideWidth = slides[0].clientWidth;
    sliderList.style.transform = `translateX(-${index * slideWidth}px)`;
    currentIndex = index;
    updateButtons();
    updateIndicators()
}

function updateButtons() {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;

}

function updateIndicators() {
    indicators.forEach(indicator => indicator.classList.remove('active'));
    indicators[currentIndex].classList.add('active');
}

function startSlide() {
    if (autoSlide) clearInterval(autoSlide);
    autoSlide = setInterval(() => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        moveSlider(currentIndex);
    }, interval)
}

function stopSlide() {
    clearInterval(autoSlide);

}

prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        moveSlider(currentIndex);
    }
    if (!paused) startSlide()
})

nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        moveSlider(currentIndex);
    }
    if (!paused) startSlide()
});

pauseButton.addEventListener("click", () => {
    if (paused) {
        startSlide();
        pauseButton.textContent = 'Pause';
    } else {
        stopSlide();
        pauseButton.textContent = 'Play';
    }
    paused = !paused;
})

indicators.forEach(indicator => {
    indicator.addEventListener("click", () => {
        stopSlide();
        const index = parseInt(indicator.getAttribute('data-index'));
        moveSlider(index);
        if (!paused) startSlide()
    });
});

function handKeyboard(event) {
    switch (event.key) {
        case "ArrowLeft":
            stopSlide()
            if (currentIndex > 0) {
                currentIndex--;
                moveSlider(currentIndex);
            }
            if (!paused) startSlide();
            break;
        case "ArrowRight":
            stopSlide();
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                moveSlider(currentIndex);
            }
            if (!paused) startSlide();
            break;
        default:
            break;
    }
}

document.addEventListener("keydown", handKeyboard);

function handTouchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

function handTouchMove(event) {
    if (startX === undefined) return;

    const X = event.touches[0].clientX;
    const diffX = startX - X;

    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            stopSlide();
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                moveSlider(currentIndex);
            }
        } else {
            stopSlide();
            if (currentIndex > 0) {
                currentIndex--;
                moveSlider(currentIndex);
            }
        }
        startX = undefined;
    }
}

function mouseDown(event) {
    startX = event.clientX;
    startY = event.clientY;
}

function mouseMove(event) {
    if (startX === undefined) return;

    const mouseX = event.clientX;
    const diffX = startX - mouseX;

    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            stopSlide();
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                moveSlider(currentIndex);
            }
        } else {
            stopSlide();
            if (currentIndex > 0) {
                currentIndex--;
                moveSlider(currentIndex);
            }
        }
    }
    startX = undefined;
}

function mouseUp() {
    startX = undefined;
}

sliderList.addEventListener("touchstart", handTouchStart);
sliderList.addEventListener("touchmove", handTouchMove);

sliderList.addEventListener("mousedown", mouseDown);
sliderList.addEventListener("mousemove", mouseMove);
sliderList.addEventListener("mouseup", mouseUp)


updateButtons();
updateIndicators()
startSlide();



