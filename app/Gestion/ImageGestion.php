<?php

namespace App\Gestion;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image;
use Intervention\Image\Image as ImageObject;

class ImageGestion extends FileGestion {
    protected $path = '';

    public function updateCover(UploadedFile $image, $oldImg, $width, $height, $x, $y) {
        return $this->cropAndReplace($image, $oldImg, intval($width), intval($height), intval($x), intval($y),'cover/');
    }

    public function updateAvatar(UploadedFile $image, $oldImg, $width, $height, $x, $y) {
        return $this->cropAndReplace($image, $oldImg, intval($width), intval($height), intval($x), intval($y),'avatar/');
    }

    public function cropAndReplace(UploadedFile $image, $oldImg, $width, $height, $x, $y, $path) {
        $filename = $this->generateName($image->getClientOriginalExtension());
        $image_resize = $this->crop($image->getRealPath(), $width, $height, $x, $y);

        $image_resize->save(public_path('storage/' . $path .$filename));

        if(strpos($oldImg, 'defaut') === false) {
            $this->delete('/storage/' . $path . $oldImg);
        }

        return $filename;
    }

    public function crop ($imagePath, $width, $height, $x, $y): ImageObject {
        return Image::make($imagePath)->crop($width, $height, $x, $y);
    }
}