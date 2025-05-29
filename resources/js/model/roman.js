$(document).on('click', 'div[data-roman]', function(){
    let slug = $(this).data('roman');

    $.ajax({
        url:"/roman/infos",
        type: 'POST',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {slug: slug},
        success:function(data) {
            $('#modal_infos .modal-content').html(data);
            $('#modal_infos').trigger('modal-open');
        }
    });
});