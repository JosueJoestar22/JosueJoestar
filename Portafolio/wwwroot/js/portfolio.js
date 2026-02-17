// ============================================
// PORTAFOLIO - JAVASCRIPT PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // ANIMACIONES DE SCROLL
    // ============================================

    // Observador de intersección para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar todas las tarjetas de habilidades
    document.querySelectorAll('.habilidad-card').forEach(card => {
        observer.observe(card);
    });

    // ============================================
    // VALIDACIÓN DEL FORMULARIO DE CONTACTO
    // ============================================

    const contactForm = document.querySelector('form[asp-action="Contacto"]');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            let isValid = true;
            let errorMessages = [];

            // Validar nombre
            if (nombre === '') {
                errorMessages.push('El nombre es obligatorio');
                isValid = false;
                document.getElementById('nombre').classList.add('is-invalid');
            } else {
                document.getElementById('nombre').classList.remove('is-invalid');
                document.getElementById('nombre').classList.add('is-valid');
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                errorMessages.push('El email es obligatorio');
                isValid = false;
                document.getElementById('email').classList.add('is-invalid');
            } else if (!emailRegex.test(email)) {
                errorMessages.push('El email no es válido');
                isValid = false;
                document.getElementById('email').classList.add('is-invalid');
            } else {
                document.getElementById('email').classList.remove('is-invalid');
                document.getElementById('email').classList.add('is-valid');
            }

            // Validar mensaje
            if (mensaje === '') {
                errorMessages.push('El mensaje es obligatorio');
                isValid = false;
                document.getElementById('mensaje').classList.add('is-invalid');
            } else if (mensaje.length < 10) {
                errorMessages.push('El mensaje debe tener al menos 10 caracteres');
                isValid = false;
                document.getElementById('mensaje').classList.add('is-invalid');
            } else {
                document.getElementById('mensaje').classList.remove('is-invalid');
                document.getElementById('mensaje').classList.add('is-valid');
            }

            if (isValid) {
                // Si todo está bien, enviar el formulario
                this.submit();
            } else {
                // Mostrar errores
                showAlert(errorMessages.join('<br>'), 'danger');
            }
        });

        // Limpiar validación al escribir
        ['nombre', 'email', 'mensaje'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', function () {
                    this.classList.remove('is-invalid', 'is-valid');
                });
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // EFECTO PARALLAX SUAVE EN IMAGEN DOTNET
    // ============================================

    const dotnetImage = document.getElementById('imagen-dotnet');
    if (dotnetImage) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            dotnetImage.style.transform = `translateY(${rate}px)`;
        });
    }

    // ============================================
    // CONTADOR DE HABILIDADES (OPCIONAL)
    // ============================================

    const skillLists = document.querySelectorAll('.habilidad-card ul');
    skillLists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });

});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function showAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ============================================
// EFECTO DE TYPING EN EL TÍTULO (OPCIONAL)
// ============================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Ejemplo de uso (puedes activarlo si quieres):
// const titulo = document.querySelector('.presentacion-titulo');
// if (titulo) {
//     const textoOriginal = titulo.textContent;
//     typeWriter(titulo, textoOriginal, 80);
// }