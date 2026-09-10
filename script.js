/* ============================================
   ATELIÊ LUZ - SCRIPT PRINCIPAL
   Funcionalidades: Filtros, WhatsApp, 
   Máscara, Animações e Menu Mobile
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // 1. FILTRO DE VESTIDOS DA COLEÇÃO
    // ============================================
    const filterBtns = document.querySelectorAll('.btn-gold-pill');
    const dressCards = document.querySelectorAll('.dress-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Remove classe active de todos os botões
            filterBtns.forEach(function (b) {
                b.classList.remove('active');
            });
            // Adiciona active no botão clicado
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            dressCards.forEach(function (card) {
                const category = card.getAttribute('data-category') || '';

                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'block';
                    // Animação suave ao aparecer
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ============================================
    // 2. MÁSCARA AUTOMÁTICA PARA CAMPO DE TELEFONE
    // Formato: (00) 00000-0000
    // ============================================
    const telInput = document.getElementById('telefone');

    if (telInput) {
        telInput.addEventListener('input', function (e) {
            let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número

            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            if (valor.length > 10) {
                // Celular com 9 dígitos: (00) 90000-0000
                valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7);
            } else if (valor.length > 6) {
                // Fixo: (00) 0000-0000
                valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 6) + '-' + valor.slice(6);
            } else if (valor.length > 2) {
                valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2);
            } else if (valor.length > 0) {
                valor = '(' + valor;
            }

            e.target.value = valor;
        });
    }

    // ============================================
    // 3. ENVIO DO FORMULÁRIO PARA WHATSAPP
    // Monta a mensagem e abre o WhatsApp automaticamente
    // ============================================
    const form = document.getElementById('formAgendamento');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Coleta os valores dos campos
            const nome = document.getElementById('nome').value.trim();
            const tel = document.getElementById('telefone').value.trim();
            const tipo = document.getElementById('tipoEvento').value;
            const data = document.getElementById('dataEvento').value;
            const detalhes = document.getElementById('detalhes').value.trim();

            // Valida os campos obrigatórios
            if (!nome || !tel || !tipo) {
                mostrarNotificacao('Por favor, preencha os campos obrigatórios (*)', 'erro');
                return;
            }

            // Monta a mensagem elegante para o WhatsApp
            let mensagem = '✨ *Solicitação de Agendamento - Ateliê Luz* ✨\n\n';
            mensagem += '👤 *Nome:* ' + nome + '\n';
            mensagem += '📱 *WhatsApp:* ' + tel + '\n';
            mensagem += '👗 *Perfil:* ' + tipo + '\n';

            if (data) {
                mensagem += '📅 *Data do Evento:* ' + formatarData(data) + '\n';
            }

            if (detalhes) {
                mensagem += '\n💬 *Detalhes:*\n' + detalhes + '\n';
            }

            mensagem += '\nAguardo retorno! 💛';

            // ⚠️ IMPORTANTE: Substitua o número abaixo pelo WhatsApp real do Ateliê Luz
            // Formato: 55 + DDD + Número (sem espaços ou traços)
            const numeroWhatsApp = '5500000000000';

            const link = 'https://wa.me/' + numeroWhatsApp + '?text=' + encodeURIComponent(mensagem);

            // Feedback visual antes de abrir o WhatsApp
            mostrarNotificacao('Redirecionando para o WhatsApp...', 'sucesso');

            setTimeout(function () {
                window.open(link, '_blank');
                form.reset();
            }, 1000);
        });
    }

    // ============================================
    // FUNÇÃO AUXILIAR: Formatar data para DD/MM/AAAA
    // ============================================
    function formatarData(dataString) {
        if (!dataString) return '';
        const partes = dataString.split('-');
        return partes[2] + '/' + partes[1] + '/' + partes[0];
    }

    // ============================================
    // 4. SISTEMA DE NOTIFICAÇÕES (TOAST)
    // ============================================
    function mostrarNotificacao(mensagem, tipo) {
        // Remove notificação anterior se existir
        const antiga = document.querySelector('.toast-atelie');
        if (antiga) antiga.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-atelie';
        toast.innerHTML = '<i class="bi bi-' + (tipo === 'sucesso' ? 'check-circle-fill' : 'exclamation-triangle-fill') + ' me-2"></i>' + mensagem;

        // Estilos inline (não precisa mexer no CSS)
        toast.style.cssText = [
            'position: fixed',
            'top: 100px',
            'right: 25px',
            'padding: 15px 25px',
            'border-radius: 12px',
            'z-index: 9999',
            'font-family: Poppins, sans-serif',
            'font-size: 14px',
            'font-weight: 500',
            'box-shadow: 0 10px 30px rgba(0,0,0,0.15)',
            'animation: slideInRight 0.4s ease',
            'max-width: 350px',
            'display: flex',
            'align-items: center'
        ].join(';');

        if (tipo === 'sucesso') {
            toast.style.background = '#25D366';
            toast.style.color = '#FFF';
        } else {
            toast.style.background = '#E74C3C';
            toast.style.color = '#FFF';
        }

        document.body.appendChild(toast);

        // Remove após 3.5 segundos
        setTimeout(function () {
            toast.style.animation = 'slideOutRight 0.4s ease forwards';
            setTimeout(function () {
                toast.remove();
            }, 400);
        }, 3500);
    }

    // Adiciona keyframes das animações do Toast dinamicamente
    if (!document.querySelector('#toastKeyframes')) {
        const style = document.createElement('style');
        style.id = 'toastKeyframes';
        style.textContent = 
            '@keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }' +
            '@keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(50px); } }';
        document.head.appendChild(style);
    }

    // ============================================
    // 5. FECHAR MENU MOBILE AO CLICAR EM LINK
    // ============================================
    const navLinks = document.querySelectorAll('#menuAtelie .nav-link, #menuAtelie .btn-gold');
    const menuMobile = document.getElementById('menuAtelie');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (menuMobile.classList.contains('show')) {
                // Usa o Collapse do Bootstrap para fechar
                const bsCollapse = bootstrap.Collapse.getInstance(menuMobile) || new bootstrap.Collapse(menuMobile, { toggle: false });
                bsCollapse.hide();
            }
        });
    });

    // ============================================
    // 6. NAVBAR COM EFEITO AO ROLAR
    // ============================================
    const navbar = document.getElementById('navbarAtelie');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
            navbar.style.paddingTop = '10px';
            navbar.style.paddingBottom = '10px';
        } else {
            navbar.style.paddingTop = '';
            navbar.style.paddingBottom = '';
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Executa uma vez no carregamento

    // ============================================
    // 7. ANIMAÇÃO REVEAL AO ROLAR A PÁGINA
    // ============================================
    const revealElements = document.querySelectorAll('.card-hover, .editorial-frame, .dress-card, .insta-photo, .accordion-item');

    // Adiciona a classe reveal em todos os elementos
    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    function handleScrollReveal() {
        const windowHeight = window.innerHeight;
        const triggerPoint = 100;

        revealElements.forEach(function (el) {
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - triggerPoint) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', handleScrollReveal);
    handleScrollReveal(); // Executa uma vez ao carregar

    // ============================================
    // 8. SMOOTH SCROLL PARA LINKS ÂNCORA
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 9. LAZY LOAD DE IMAGENS DE FUNDO
    // Otimiza o carregamento das fotos do site
    // ============================================
    const lazyBgs = document.querySelectorAll('[style*="background-image"]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        lazyBgs.forEach(function (bg) {
            bg.style.transition = 'opacity 0.6s ease';
            observer.observe(bg);
        });
    }

    // ============================================
    // 10. LOG DE BOAS-VINDAS NO CONSOLE
    // ============================================
    console.log('%c✨ Ateliê Luz ✨', 'color: #C5A059; font-size: 24px; font-weight: bold; font-family: serif;');
    console.log('%cModa Festa & Noivas - Apucarana/PR', 'color: #8B8580; font-size: 12px;');
    console.log('%cSite desenvolvido com ❤️', 'color: #C5A059; font-size: 11px;');

});