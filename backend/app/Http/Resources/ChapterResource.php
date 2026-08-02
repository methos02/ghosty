<?php

namespace App\Http\Resources;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Chapter
 */
class ChapterResource extends JsonResource
{
    /**
     * `is_branch` est dérivé : une proposition devient une branche dès qu'une
     * suite publiée la poursuit — il n'existe pas d'entité « branche ».
     *
     * @see memory-bank/decisions/ADR-07-modele-multivers-arbre-de-chapitres.md
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'novel_id' => $this->novel_id,
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'summary' => $this->summary,
            'content' => $this->when($this->shouldExposeContent($request), $this->content),
            'depth' => $this->depth,
            'is_main_child' => $this->is_main_child,
            'is_branch' => $this->isBranch(),
            'continuations_count' => $this->continuations_count,
            'like_count' => $this->like_count,
            'comment_count' => $this->comment_count,
            'status' => $this->status,
            'author' => [
                'id' => $this->author_id,
                'pseudo' => $this->whenLoaded('author', fn () => $this->author?->pseudo),
            ],
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }

    /**
     * Le texte intégral n'est servi que sur la fiche d'un chapitre : une liste
     * de continuité en renverrait autant de `longText` que de chapitres.
     */
    private function shouldExposeContent(Request $request): bool
    {
        return $request->routeIs('chapters.show');
    }
}
