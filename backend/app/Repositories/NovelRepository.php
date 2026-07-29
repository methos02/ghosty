<?php

namespace App\Repositories;

use App\Models\Novel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NovelRepository
{
    public function paginateWithRelations(int $perPage = 15): LengthAwarePaginator
    {
        return Novel::with(['genre', 'author'])->paginate($perPage);
    }

    public function findBySlugWithRelations(string $slug): Novel
    {
        return Novel::with(['genre', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
