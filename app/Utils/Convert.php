<?php


namespace App\Utils;


class Convert {
    public static function intToStr($int) {
        switch ($int) {
            case 1:
                return "premier";
                break;
            case 2:
                return "second";
                break;
            case 3:
                return "troisième";
                break;
            case 4:
                return "quatrième";
                break;
            case 5:
                return "cinquième";
                break;
            case 6:
                return "sixième";
                break;
            case 7:
                return "septième";
                break;
            case 8:
                return "huitième";
                break;
            case 9:
                return "neuvième";
                break;
            case 10:
                return "dixième";
                break;
            case 11:
                return "onzième";
                break;
            case 12:
                return "douzième";
                break;
            default:
                return false;
        }
    }
}