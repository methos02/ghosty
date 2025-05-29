$(document).on('click', 'a[data-action=mode_lecture]', function(e){
    e.preventDefault();
    $('a[data-action=mode_lecture]').toggle(150);
    $('.content').toggleClass('mode-lecture');
});