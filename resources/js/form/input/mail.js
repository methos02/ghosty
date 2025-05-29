export function verifMail(input, event) {
    let input_2 = $('input[name = '+ input.name +'_2]');
    let isConfirmation = (input_2.attr('name') === input.$champ.attr('name'));
    let regex = new RegExp(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/);


    if (!regex.test(input.value) && input.value.length !== 0) {
        return (event === 'focusout' && isConfirmation)?  "2": "";
    }

    if($('input[data-type=mail][data-nom =' + input.name +']').length === 2&& input_2.val().length !== 0) {
        return verif2mail(input.name, event);
    }
}

function verif2mail(nom, event){
    let input_2 = $('input[name= '+ nom + '_2]');
    let mail_1 = $('input[name=' + nom + '_1]').val();
    let mail_2 = input_2.val();

    /*Initialisation*/
    input_2.removeClass('input_prefixe input_valide');

    if(mail_1 !== mail_2){
        return (event === "focusout" || event === "submit")? "diffenrent" : '';
    }
}