<?php

namespace Tests\Unit\Helpers;

use App\Helpers\AggregateHelper;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class AggregateHelperTest extends TestCase
{
    #[Test]
    public function reads_the_numeric_string_returned_by_the_database(): void
    {
        $this->assertSame(42, AggregateHelper::toInteger('42'));
    }

    #[Test]
    public function keeps_an_integer_as_it_is(): void
    {
        $this->assertSame(7, AggregateHelper::toInteger(7));
    }

    #[Test]
    public function counts_zero_when_the_aggregate_is_missing(): void
    {
        $this->assertSame(0, AggregateHelper::toInteger(null));
    }
}
