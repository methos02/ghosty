import {popstate_lire} from "./popstate/lecture";
import {popstate_home_add} from "./popstate/home_add";
import {popstate_home_roman} from "./popstate/home_roman";

window.onpopstate = function() {
    if (location.pathname.indexOf('/lire/') !== -1) {
        popstate_lire();
    }

    if (location.pathname.indexOf('/continu/') !== -1 || location.pathname.indexOf('/vote/') !== -1) {
        popstate_home_roman()
    }

    if (location.pathname.indexOf('/add') !== -1){
        popstate_home_add();
    }
};