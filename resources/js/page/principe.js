if($('.navbar-principe').length !== 0) {
    let sections = [];
    let lastScrollTop = 0;
    let id_link = false;
    let last_id;

    $('.navbar-principe .nav-secondaire a').each(function() {
        sections.push($($(this).attr('href')));
    });

    $(document).on('click', 'a[href^="#"]', function(e){
        if($(window).width() < 767) {
            $('.nav-secondaire a').removeClass('principe-link-clicked');
            $('.principe-content').toggleClass('side-menu');
            $('.nav-secondaire').toggleClass('nav-secondaire-moved');
            return;
        }

        e.preventDefault();
        let target = this.hash;
        let $target = $(target);

        $('html,body').animate({'scrollTop': $target[0].offsetTop}, 1500, 'swing');
    });

    $('[data-affiche=side-menu]').on('click', function () {
        for (let i in sections) {
            if($(sections[i]).offset().top >= 0 || parseInt(i) + 1 === sections.length) {
                id_link = sections[i].attr('id');
                break;
            }
        }

        $('.nav-secondaire a').removeClass('principe-link-clicked');
        $('.nav-secondaire a[href="#' + id_link + '"]').addClass('principe-link-clicked');
        $('.principe-content').toggleClass('side-menu');
        $('.nav-secondaire').toggleClass('nav-secondaire-moved');
    });

    $('.principe-content').on('click', function (e) {
        if($(window).width() < 767 && $(e.target).closest('.navbar-principe').length === 0) {
            $(this).removeClass('side-menu');
        }
    });

    $(window).on('scroll',function(){
        let scrollTop = $(this).scrollTop();

        $('.navbar-principe').toggleClass('navbar-moved', scrollTop !== 0 && $(window).width() > 767);

        for (let i in sections) {
            if(scrollTop + ($(window).height() / 2)> sections[i][0].offsetTop) {
                id_link = sections[i].attr('id');
            }
        }

        if(last_id !== id_link) {
            $('.navbar-principe .nav-secondaire a').removeClass('principe-link-clicked');
            $('.navbar-principe .nav-secondaire a[href="#' + id_link + '"]').addClass('principe-link-clicked');
            last_id = id_link;
        }

        lastScrollTop = scrollTop;
    });
}
