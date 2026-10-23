$(document).ready(function () {
    // 1. Control del menú desplegable con hover individual
    $("ul.parent > li").hover(
        function () {
            // Ocultamos cualquier otro submenú abierto por seguridad
            $("ul.parent ul.child").stop(true, true).slideUp(200);
            // Mostramos únicamente el submenú del elemento actual
            $(this).children("ul.child").stop(true, true).slideDown(200);
        },
        function () {
            // Ocultamos el submenú al retirar el mouse
            $(this).children("ul.child").stop(true, true).slideUp(200);
        }
    );

    // 2. Inicialización de FullPage.js
    $('#fullpage').fullpage({
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Inicio', 'Presentación', 'Servicios', 'Galería', 'Contacto'],
        showActiveTooltip: false,
        sectionsColor: ['#f2f2f2', '#ccc', '#7BAABE', '#f90', '#ccc'],
        slidesNavigation: true,
        slidesNavPosition: 'bottom',

        // Funciones de navigation
        menu: '#menu', 
        anchors: ['inicio', 'presentacion', 'animes', 'galeria', 'contacto']
    });
});