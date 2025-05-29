$(window).on('load',function(){
    if($('.compteur').length !== -1) {
        setInterval(function() {
            let now = new Date();

            if($('[data-decompte=init]').length !== 0) {
                initCompteur(now);
                return;
            }

            updateSeconde(now);

        }, 1000);
    }
});

function initCompteur(now) {
    updateJour(now);
    updateHeure(now);
    updateMinute(now);
    updateSeconde(now);

    $('[data-compteur=init]').removeAttr('data-compteur');
}

function updateJour(now) {
    let d = 7 - now.getDay();

    $('.jour').html(function () {
        return d === 7? '00' :'0' + d;
    });
}

function updateHeure(now) {
    let h = 23 - now.getHours();

    $('.heure').html(function () {
        return h < 10? '0' + h : h;
    });

    if(h === 23) updateJour(now);
}

function updateMinute(now) {
    let m = 59 - now.getMinutes();

    $('.minute').html(function () {
        return m < 10 ?'0' + m : m;
    });

    if(m === 59) updateHeure(now);
}

function updateSeconde(now) {
    let s = 59 - now.getSeconds();

    $('.seconde').html(function () { return s < 10? '0' + s : s; });

    if(s === 59)  updateMinute(now);
}