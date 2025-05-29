import {getHomeRoman} from "../page/home";

export function popstate_home_roman () {
    let pathnameSplit = location.pathname.split('/');
    let page = pathnameSplit[1];
    let genre = pathnameSplit[2];
    let tri = pathnameSplit[3];

    $('#genre_roman').val(genre);
    $('#order_roman').val(tri);

    getHomeRoman(page, false)
}