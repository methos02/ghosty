window.flash = {
    appendGlobalMessage: function(div, message, type) {
        let messageEl = this.createGlobalMessage(message, type, 'global');
        $(div).append(messageEl);
    },

    appendMessage: function (div, message, type) {
        let messageEl = this.createMessage(message, type);
        $(div).append(messageEl);
    },

    siblingMessage: function (div, message, type) {
        let messageEl = this.createMessage(message, type);
        messageEl.insertAfter(div);
    },

    messageErrorsForm: function (messages) {
        let $this = this;

        $.each(messages, function(index, value) {
            $this.messageErrorForm('[name=' + index + ']', value[0])
        });
    },

    messageErrorForm: function (div, message) {
        this.siblingMessage(div, message, 'input_message', 'erreur')
    },

    messageGlobalSuccess: function (div, message) {

        this.appendGlobalMessage(div, message, 'message-global message-success')
    },

    messageError: function messageError(div, message) {
        this.appendMessage(div, message, 'alert')
    },

    createGlobalMessage: function(message, type, data) {
        message = '<span>' + message + '</span><button class="btn-close-msg" data-close="message-global">X</button>';
        return this.createMessage(message, type, data);
    },

    createMessage: function (message, type, data) {
        data = (data !== undefined) ? data : "";

        return $('<span>', {
            html: message,
            class: type,
            "data-message": data,
            "data-flash": ""
        });
    },

    closeMessage: function(btn) {
        let div = $(btn).closest('[data-flash]');
        div.fadeOut(500);

        setTimeout(function () {
            div.remove()
        }, 500);
    }
};

$(document).on('click', '[data-close=message-global]', function() {
    window.flash.closeMessage(this);
});

$( document ).ready(function() {
    let messages = $('.loading-page');

    if(messages.length !== 0) {
        messages.fadeIn(300, function() {
            messages.removeClass('loading-page');
        });
    }
});
