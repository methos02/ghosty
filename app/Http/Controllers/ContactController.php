<?php

namespace App\Http\Controllers;

use App\Utils\SendInBlue;
use App\Http\Requests\ContactRequest;

class ContactController extends Controller {
    public function contact() {
        return view('contact');
    }

    public function send(ContactRequest $request, SendInBlue $mailler) {
        $params = [
            'replyTo' => $request->input('mail'),
            'attributes' => ['SUJET' => $request->input('sujet'), 'MESSAGE' => nl2br($request->input('message'))]
        ];

        $mailler->sendContact($params);

        return back()->with('ok', 'Merci pour votre retour, nous allons vous répondre dès que possible.');
    }
}
