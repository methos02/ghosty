<?php


namespace App\Utils;


class HtmlShortcut {

    public static function isVisible($state) {
        return $state ? '' : 'style="display: none"';
    }
}