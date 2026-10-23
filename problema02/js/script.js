$(document).ready(function () {
    $("ul.parent > li").hover(
        function () {
            $("ul.parent ul.child").stop(true, true).slideUp(200);
            $(this).children("ul.child").stop(true, true).slideDown(200);
        },
        function () {
            $(this).children("ul.child").stop(true, true).slideUp(200);
        }
    );

    $('#fullpage').fullpage({
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Inicio', 'Presentación', 'Servicios', 'Galería', 'Contacto'],
        showActiveTooltip: false,
        sectionsColor: ['#f2f2f2', '#ccc', '#7BAABE', '#f90', '#ccc'],
        slidesNavigation: true,
        slidesNavPosition: 'bottom',

        menu: '#menu', 
        anchors: ['inicio', 'presentacion', 'animes', 'galeria', 'contacto']
    });
});