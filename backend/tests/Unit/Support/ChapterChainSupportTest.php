<?php

namespace Tests\Unit\Support;

use App\Models\Chapter;
use App\Support\ChapterChainSupport;
use Illuminate\Support\Collection;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class ChapterChainSupportTest extends TestCase
{
    private function chapter(int $id, ?int $parentId): Chapter
    {
        return (new Chapter)->forceFill(['id' => $id, 'parent_id' => $parentId]);
    }

    #[Test]
    public function orders_the_chapters_from_the_root_down(): void
    {
        $chain = ChapterChainSupport::fromRoot(new Collection([
            $this->chapter(12, 11),
            $this->chapter(10, null),
            $this->chapter(11, 10),
        ]));

        $this->assertSame([10, 11, 12], $chain->pluck('id')->all());
    }

    #[Test]
    public function returns_nothing_when_no_root_is_in_reach(): void
    {
        $chain = ChapterChainSupport::fromRoot(new Collection([$this->chapter(11, 10)]));

        $this->assertTrue($chain->isEmpty());
    }

    #[Test]
    public function stops_where_the_chain_is_broken(): void
    {
        $chain = ChapterChainSupport::fromRoot(new Collection([
            $this->chapter(10, null),
            $this->chapter(12, 11),
        ]));

        $this->assertSame([10], $chain->pluck('id')->all());
    }
}
