$('[data-open=dropdown-content]:not(.b-yellow-light)').on('click', function(e){
    e.preventDefault();
    $('[data-menu=dropdown]').fadeToggle(500);
    $('.link-hamburger').toggleClass('open');
});

$(window).click(function(e) {
    if(!$(e.target).hasClass('link-hamburger')){
        $('[data-menu=dropdown]').fadeOut(500);
        $('.link-hamburger').removeClass('open');
    }
});