$(document).on('change', '#order_roman, #genre_roman', function() {
    let page = $('.btn-switch.visited').data('page');
    getHomeRoman(page);
});

$(document).on('click', 'a[data-page]', function(e) {
    e.preventDefault();
    let page = $(this).data('page');

    if (location.pathname.indexOf(page) !== -1) return;

    if(page !== 'add') {
        getHomeRoman(page);
        return;
    }

    afficheRomanAdd(page);
});

export function getHomeRoman(page, pushState) {
    let tri = $('#order_roman').val();
    let genre = $('#genre_roman').val();

    $.ajax({
        url: "/html/home/roman",
        type: 'POST',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {genre:genre, tri:tri, page: page},
        success:function(data) {
            let div = $(data);
            let oeuvre_height = $('.oeuvre-cover img').height();

            div.find('img').on('load', function() { $(this).removeAttr('style') });
            div.find('img').css('height', oeuvre_height);

            $('#home-' + page).html(div);

            switchBtnPage(page);

            if(pushState !== false) {
                history.pushState('', '', '/' + page +'/' + genre + '/' + tri);
            }
        }
    });
}

export function afficheRomanAdd(page, pushState) {
    let slug_genre = $('select[name=slug_genre]').val();
    let url_slug = slug_genre !== '-1' ? '/' + slug_genre : '';

    switchBtnPage(page);

    if(pushState !== false) {
        history.pushState('', '', '/add' + url_slug);
    }
}

function switchBtnPage(page) {
    $('a[data-page]').each(function(){
        $(this).toggleClass('visited', $(this).data('page') === page);
    });

    $('div[id*=home-]').each(function(){
        $(this).toggle($(this).attr('id') === 'home-' +page)
    });

    $('.navbar-side select').attr('disabled', function(){
        return page === 'add' ? 'disabled' : false;
    });
}