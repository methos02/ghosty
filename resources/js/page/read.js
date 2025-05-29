$(window).on('scroll', function() {
    let height = $('#div-first').outerHeight(true);

    $('#read-toolbar').toggleClass('sticky', $(window).scrollTop() > height);
    $('#chapitre-content').toggleClass('sticky', $(window).scrollTop() > height);
});