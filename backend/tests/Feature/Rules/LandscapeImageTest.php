<?php

namespace Tests\Feature\Rules;

use App\Rules\LandscapeImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LandscapeImageTest extends TestCase
{
    private function passes(mixed $value): bool
    {
        return Validator::make(['image' => $value], ['image' => [new LandscapeImage]])->passes();
    }

    #[Test]
    public function accepts_an_image_wider_than_tall(): void
    {
        $this->assertTrue($this->passes(UploadedFile::fake()->image('couverture.jpg', 1600, 900)));
    }

    #[Test]
    public function refuses_a_square_image(): void
    {
        $this->assertFalse($this->passes(UploadedFile::fake()->image('couverture.jpg', 900, 900)));
    }

    #[Test]
    public function refuses_an_image_taller_than_wide(): void
    {
        $this->assertFalse($this->passes(UploadedFile::fake()->image('couverture.jpg', 900, 1600)));
    }

    #[Test]
    public function refuses_a_file_that_is_not_an_image(): void
    {
        $this->assertFalse($this->passes(UploadedFile::fake()->create('couverture.pdf', 10, 'application/pdf')));
    }
}
