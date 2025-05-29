$(document).on('click', 'button[data-close=modal]', function (e) {
    e.preventDefault();
    let modal = $(this).closest('.modal');
    close_modal(modal);
});

$(document).on('modal-close', '.modal', function(){
    close_modal($('.show-modal'));
});

$(document).on('click', function (e) {
    let modal_open = $('.modal.show-modal');

    if(modal_open.length !== 0 && $(e.target).hasClass('modal')) {
        close_modal(modal_open);
    }
});

$(document).on('modal-open', '.modal', function(){
    $(this).addClass('show-modal');

    if($('.content').height() > screen.height)
        $('body').css('top', -(document.documentElement.scrollTop) + 'px').addClass('body-modal-open');
});

function close_modal(modal) {
    let body = $('body');
    let y = -1 * parseInt(body.css('top'));
    modal.removeClass('show-modal');
    body.removeClass('body-modal-open');
    window.scrollTo(0,y);
    setTimeout(function(){$('.modal').trigger('modalClose');}, 300);
    modal.trigger('modal-close');
}

