$(document).on('click', '[data-save=azertyucropper]', function(e){
    e.preventDefault();
    let form = document.getElementsByName('form-avatar');
    let formData =  new FormData(form[0]);

    $.ajax({
        url:"/update_avatar",
        type: 'POST',
        contentType: false, // obligatoire pour de l'upload
        processData: false, // obligatoire pour de l'upload
        dataType: 'json',
        data: formData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success:function(data) {
            $('[data-preview]').attr('src', data.path_image);
            window.flash.messageGlobalSuccess('body', data.message);
        },
    });

    $('#Modal-resize').removeClass('show-modal');
});

$(document).on('click', 'input[name=notif]', function(){
    let notif = $(this).is(':checked')? "1" : "0";
    let data = {notif: notif };

    $.ajax({
        url:"/update_notif",
        type: 'POST',
        data: data,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success:function(data) {
            $('#notif-disable').toggle(notif !== "1");
            window.flash.messageGlobalSuccess('body', data.message);
        },
    });

    $('#Modal-resize').removeClass('show-modal');
});