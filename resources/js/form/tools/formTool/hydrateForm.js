export function hydrateForm($form, data, action) {
    $form.find(':input').each(function(){
        let name = $(this).attr('name');
        let type = $(this).attr('type');

        $(this).removeAttr('disabled');

        if(data[name] === undefined) return;

        if($.inArray(action, 'init') === -1 ) {
            $(this).trigger('init-input');
        }

        if(type === 'file' && $(this).data('cropper') !== undefined) {
            $('#appercu-' + name).attr('src', '/storage/cover/' + data[name]);
            return;
        }

        $(this).val(data[name]);

        if($(this).is('textarea') && $('#compteur-' + name).length !== 0) {
            $(this).trigger('update-compteur');
        }

        if($(this).closest('[data-uform]').length !== 0) {
            $(this).trigger('uform-valide');
        }
    });
}