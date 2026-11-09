<?php

namespace Tests\Unit\Helpers;

use App\Helpers\ChapterChainHelper;
use App\Models\Chapter;
use Illuminate\Support\Collection;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class ChapterChainHelperTest extends TestCase
{
    private function chapter(int $id, ?int $parentId): Chapter
    {
        return (new Chapter)->forceFill(['id' => $id, 'parent_id' => $parentId]);
    }

    #[Test]
    public function orders_the_chapters_from_the_root_down(): void
    {
        $chain = ChapterChainHelper::fromRoot(new Collection([
            $this->chapter(12, 11),
            $this->chapter(10, null),
            $this->chapter(11, 10),
        ]));

        $this->assertSame([10, 11, 12], $chain->pluck('id')->all());
    }

    #[Test]
    public function returns_nothing_when_no_root_is_in_reach(): void
    {
        $chain = ChapterChainHelper::fromRoot(new Collection([$this->chapter(11, 10)]));

        $this->assertTrue($chain->isEmpty());
    }

    #[Test]
    public function stops_where_the_chain_is_broken(): void
    {
        $chain = ChapterChainHelper::fromRoot(new Collection([
            $this->chapter(10, null),
            $this->chapter(12, 11),
        ]));

        $this->assertSame([10], $chain->pluck('id')->all());
    }
}
