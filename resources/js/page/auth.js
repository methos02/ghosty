$('[data-affiche=btn-register], [data-affiche=btn-login]').on('click', function () {
    $('#div-switch-connexion').css({
        'left' :   $(this).data('affiche') === 'btn-login'? '' : '50%',
        'border-radius' : $(this).data('affiche') === 'btn-login'? '' : '0 3px 3px 0'
    });

    let divAttr = $(this).data('affiche');
    let div = $('[data-div=' + divAttr + ']');

    div.siblings('[data-div]').fadeOut(150, function(){
        div.fadeIn(150);
    });
});

$('[data-affiche=reset], [data-affiche=login]').on('click', function(e){
    e.preventDefault();
    let divAttr = $(this).data('affiche');
    let div = $('[data-div=' + divAttr + ']');

    div.siblings('[data-div]').fadeOut(150, function(){
        div.fadeIn(150);
    });
});