document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section, header');
    const navButtons = document.querySelectorAll('.nav-float-btn');

    // Cambiar estado activo según la sección visible
    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${currentSection}`) {
                btn.classList.add('active');
            }
        });
    });

    // Renderizar tarjetas de proyectos dinámicamente
    renderProjects();
});

function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container || typeof proyectos === 'undefined') return;

    container.innerHTML = proyectos.map(p => `
        <div class="project-card">
            <div class="project-preview">
                <i class="fa-solid ${p.icono || 'fa-code'} project-placeholder-icon"></i>
            </div>
            <div class="project-content">
                <span class="project-tag">${p.categoria}</span>
                <h3>${p.titulo}</h3>
                <p>${p.descripcion}</p>
                <div class="project-links">
                    ${p.demoUrl ? `
                        <a href="${p.demoUrl}" target="_blank" rel="noopener noreferrer" class="link-btn">
                            Ver Demo <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>` : ''}
                    ${p.githubUrl ? `
                        <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="link-btn link-github">
                            <i class="fa-brands fa-github"></i> Código
                        </a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}