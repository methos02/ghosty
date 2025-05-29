<?php

namespace App\Http\Middleware;

use Closure;
use Redirect;

class VerifiedOrGuest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if($request->user() && !$request->user()->hasVerifiedEmail()) {
            return Redirect::route('verification.notice');
        }

        return $next($request);
    }
}
