<?php

namespace App\Repositories;

use App\Models\Work;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WorkRepository
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Work>
     */
    public function filter(array $filters): LengthAwarePaginator
    {
        return Work::query()
            ->when(
                filled($filters['novel_slug'] ?? null),
                fn ($query) => $query->whereHas(
                    'novel',
                    fn ($novel) => $novel->where('slug', $filters['novel_slug'])
                )
            )
            ->when(
                filled($filters['order'] ?? null),
                fn ($query) => $query->where('order', (int) $filters['order'])
            )
            ->when(
                filled($filters['type'] ?? null),
                fn ($query) => $query->where('type', (int) $filters['type'])
            )
            ->orderBy('order')
            ->paginate(15);
    }
}
