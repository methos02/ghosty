import {getChapitre} from "../model/chapitre";

export function popstate_lire() {
    let slug = location.pathname.match(/\/lire\/(.*)/)[1];
    getChapitre(slug);
}