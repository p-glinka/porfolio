// js/carousel.js

function renderCarousel(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    // Duplicamos para que el carrusel continuo no tenga vacíos
    const listToRender = data.length < 6 ? [...data, ...data, ...data] : data;

    listToRender.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        // Evento al tocar la tarjeta -> Abrir Modal
        slide.addEventListener('click', () => {
            openVideoModal(item);
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
                            Ver Proyecto <i class="fa-solid fa-expand"></i>
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

    startAutoRotate(track);
}

function startAutoRotate(track) {
    let interval = null;

    function moveNext() {
        const firstChild = track.firstElementChild;
        if (!firstChild) return;

        const gap = 16;
        const shiftAmount = firstChild.getBoundingClientRect().width + gap;

        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(-${shiftAmount}px)`;

        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(firstChild);
            track.style.transform = 'translateX(0)';
        }, 600);
    }

    function start() {
        if (!interval) {
            interval = setInterval(moveNext, 2000);
        }
    }

    function stop() {
        clearInterval(interval);
        interval = null;
    }

    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);

    start();
}

/* ==========================================
   GESTIÓN DEL MODAL FLOTANTE
   ========================================== */
function openVideoModal(item) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('modalVideoPlayer');
    const category = document.getElementById('modalCategory');
    const title = document.getElementById('modalTitle');
    const link = document.getElementById('modalProjectLink');

    if (!modal || !player) return;

    player.src = item.videoSrc;
    category.textContent = item.category;
    title.textContent = item.title;

    if (item.targetUrl && item.targetUrl !== '#') {
        link.href = item.targetUrl;
        link.style.display = 'inline-flex';
    } else {
        link.style.display = 'none';
    }

    modal.classList.add('active');
    player.play();
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('modalVideoPlayer');

    if (!modal) return;

    modal.classList.remove('active');
    if (player) {
        player.pause();
        player.currentTime = 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof carouselData !== 'undefined') {
        renderCarousel('heroCarouselContainer', carouselData);
    }

    // Listeners para cerrar el modal
    const closeBtn = document.getElementById('modalCloseBtn');
    const overlay = document.getElementById('modalOverlay');

    if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
    if (overlay) overlay.addEventListener('click', closeVideoModal);

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeVideoModal();
    });
});