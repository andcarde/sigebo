
// navbar.js
'use strict';

const navLinks = [
    { text: 'inicio', page: '' },
    { text: 'inventario', page: 'inventario' },
    { text: 'trazabilidad', page: 'trazabilidad' },
    { text: 'parcelas', page: 'parcelas' },
    { text: 'bodegas', page: 'bodegas' }
];

function setNavbar(PAGE) {
    const closeSession = { text: 'cerrar sesión', page: 'cerrar-sesion' };
    const $navbar = $('#navbar');
    $navbar.empty();

    const $nav = $('<nav>');
    navLinks.forEach((link) => {
        $nav.append(buildNavElement(link.text, link.page));
    });

    function buildNavElement(text, page,) {
        const $ul = $('<ul>').attr('data-page', page);
        const $a = $('<a>').attr('href', `/${page}`);
        const capitalText = text.toUpperCase();
        const $p = $('<p>').text(capitalText);
        $a.append($p);
        $ul.append($a);
        return $ul;
    }

    const $closeSession = buildNavElement(closeSession.text, closeSession.page);
    $closeSession.addClass('nav-elem-close-session');
    $nav.append($closeSession);

    $navbar.append($nav);

    if (PAGE)
        $(`nav ul[data-page="${PAGE}"]`).addClass('nav-elem-selected');
}

$(document).ready(() => {
    const PAGE = window.location.pathname.split('/')[1];
    const $navbar = $('#navbar');

    setNavbar(PAGE);
    $(window).on('resize', handleResize);

    function handleResize() {
        if (window.innerWidth < 1100) {
            $navbar.empty();
            const $icon = $('<div>').addClass('navbar-icon').text('☰');
            const $dropdown = $('<div>').addClass('navbar-dropdown').hide();

            navLinks.concat(closeSession).forEach((link) => {
                const $dropdownItem = $('<div>').addClass('dropdown-item');
                const $a = $('<a>').text(link.text.toUpperCase());
                $a.on('click', () => {
                    window.location.href = `/${link.page}`;
                });
                $dropdownItem.append($a);
                $dropdown.append($dropdownItem);
            });

            $icon.on('mouseenter', () => {
                $dropdown.show();
            });

            $navbar.on('mouseleave', () => {
                $dropdown.hide();
            });

            $navbar.append($icon);
            $navbar.append($dropdown);

            // Set styles with JavaScript
            $('.title').css({
                'border': '1px solid rgb(0, 170, 110)',
                'background-color': 'rgb(247, 247, 247)',
                'color': 'rgb(50, 50, 170)',
                'padding-right': '5rem'
            });
        } else {
            // Set styles with JavaScript
            $('.title').css({
                'border': '1px solid rgb(0, 0, 0)',
                'border-top': 'none',
                'background-color': 'rgb(255, 255, 255)',
                'color': 'rgb(0, 0, 0)',
                'padding-right': '0'
            });
            setNavbar(PAGE);
        }
    }
});