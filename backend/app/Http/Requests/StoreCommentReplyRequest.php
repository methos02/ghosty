<?php

namespace App\Http\Requests;

class StoreCommentReplyRequest extends StoreCommentRequest
{
    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'mentioned_user_id' => ['sometimes', 'nullable', 'integer'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            ...parent::messages(),
            'mentioned_user_id.integer' => __('validation.comment.mentioned_user_id.integer'),
        ];
    }
}
