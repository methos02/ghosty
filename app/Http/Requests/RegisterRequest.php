<?php

namespace App\Http\Requests;

use App\Repositories\UserRepository;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @param UserRepository $userR
     * @return array
     */
    public function rules(UserRepository $userR)
    {
        $user = $userR->findByMail($this->input('email'));
        $uniq_pseudo = empty($user)? '|unique:users,pseudo' : '';

        return [
            'pseudo' => 'required|string|alpha_num|max:255' . $uniq_pseudo,
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6|confirmed',
            'mailling' => 'sometimes|accepted'
        ];
    }
}
