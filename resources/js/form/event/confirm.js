$(document).on('click', 'button[data-confirm]', function(e){
    e.preventDefault();
    let data = $(this).data('confirm');

    $(this).closest('[data-confirm]:not(button)').hide(0, function() {
        $('[data-confirm = ' + data + ']').show(0)
    });
});