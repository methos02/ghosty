<?php

namespace App\Gestion;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class FileGestion {
    protected $path = '';

    public function generateName($ext) {
        return str_random() . '.' . $ext;
    }

    public function addOrUpdate($file, $dbFile) {
        if(!$file instanceof UploadedFile) return $dbFile;
        if($dbFile === null) return $this->save($file);

        return $this->modif($file, $dbFile);
    }

    public function save(UploadedFile $file) {
        $fileName = str_random() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path($this->path), $fileName);

        return $fileName;
    }

    public function delete (string $filePath) {
        File::delete(public_path($this->path) . $filePath);
    }

    public function modif(UploadedFile $file, string $fileName) {
        if(!in_array($fileName, $this->defaut)) {
            $this->delete($fileName);
        }

        return $this->save($file);
    }
}