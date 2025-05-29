<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
/**
 * @property string cover
 */
class Oeuvre extends Model {
    protected $table;
    public $path_cover = 'storage/miniature/';

    public function getCoverPathAttribute() {
        return $this->path_cover . $this->cover;
    }
}
