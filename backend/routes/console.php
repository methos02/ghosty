<?php

use App\Console\Commands\RecomputeBranchLikeCountsCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(RecomputeBranchLikeCountsCommand::class)
    ->everyFiveMinutes()
    ->withoutOverlapping();
