// js/carousel.js

function renderCarousel(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    // Para evitar huecos en blanco, duplicamos el array de datos si hay pocas tarjetas
    const listToRender = data.length < 6 ? [...data, ...data, ...data] : data;

    listToRender.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        slide.addEventListener('click', () => {
            if (item.targetUrl && item.targetUrl !== '#') {
                window.open(item.targetUrl, '_blank', 'noopener,noreferrer');
            }
        });

        const isImageOrGif = item.videoSrc.endsWith('.gif') || 
                             item.videoSrc.endsWith('.jpg') || 
                             item.videoSrc.endsWith('.png');

        const mediaHTML = isImageOrGif 
            ? `<img src="${item.videoSrc}" alt="${item.title}" class="carousel-media-img">`
            : `<video src="${item.videoSrc}" poster="${item.posterSrc || ''}" autoplay loop muted playsinline></video>`;

        slide.innerHTML = `
            <div class="carousel-card">
                <div class="carousel-media">
                    ${mediaHTML}
                    <div class="carousel-overlay">
                        <span class="carousel-action-btn">
                            Ver Proyecto <i class="fa-solid fa-arrow-right"></i>
                        </span>
                    </div>
                </div>
                <div class="carousel-info">
                    <span class="carousel-tag">${item.category}</span>
                    <h3 class="carousel-title">${item.title}</h3>
                </div>
            </div>
        `;

        track.appendChild(slide);
    });

    container.appendChild(track);

    // Activar rotación continua sin cortes
    startAutoRotate(track);
}

function startAutoRotate(track) {
    let interval = null;

    function moveNext() {
        const firstChild = track.firstElementChild;
        if (!firstChild) return;

        const gap = 16;
        const shiftAmount = firstChild.getBoundingClientRect().width + gap;

        // Desplazamiento fluido hacia la izquierda
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(-${shiftAmount}px)`;

        // Al finalizar el movimiento, pasamos la tarjeta al final y reseteamos sin parpadeos
        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(firstChild);
            track.style.transform = 'translateX(0)';
        }, 600);
    }

    function start() {
        if (!interval) {
            interval = setInterval(moveNext, 2000); // Avanza cada 2 segundos
        }
    }

    function stop() {
        clearInterval(interval);
        interval = null;
    }

    // Pausar rotación si la persona pone el mouse encima
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);

    start();
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof carouselData !== 'undefined') {
        renderCarousel('heroCarouselContainer', carouselData);
    }
});