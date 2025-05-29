<?php
namespace App\Api;

use App\User;
use Auth;
use URL;

class SendInBlue {
    CONST API_KEY = null;
    CONST EMAILTO = 'contact@ghosty.fr';

    CONST ID_CONTACT = 3;
    CONST ID_MAIL_RESET = 4;
    CONST ID_MAIL_VERIF = 1;
    CONST ID_MAIL_PASSWORD = 2;

    public function sendContact($params) {
        $params['emailTo'] = [SendInBlue::EMAILTO];
        return $this->sendMail(SendInBlue::ID_CONTACT, $params);
    }

    public function sendMailReset($mail, $key) {
        /** @var User $user */
        $user = Auth::user();

        $params = [
            'emailTo' => [$mail],
            'attributes' => [
                'PSEUDO' => $user->pseudo,
                'LIEN' => env('APP_URL') . '/mail_validate/' . $key
            ]
        ];

        return $this->sendMail(SendInBlue::ID_MAIL_RESET, $params);
    }

    public function sendMailVerif(User $user) {
        $params = [
            'emailTo' => [$user->email],
            'attributes' => [
                'LIEN' => $this->formatUrl(URL::signedRoute('verification.verify', ['id' => $user->getKey()])),
                'PSEUDO' => $user->pseudo
            ]
        ];

        return $this->sendMail(SendInBlue::ID_MAIL_VERIF, $params);
    }

    public function sendMailResetPAssword(User $user, $token) {
        $params = [
            'emailTo' => [$user->email],
            'attributes' => [
                'LIEN' => $this->formatUrl(url('/') . '/password/reset/' . $token . '?email=' . $user->email),
                'PSEUDO' => $user->pseudo
            ]
        ];

        return $this->sendMail(SendInBlue::ID_MAIL_PASSWORD, $params);
    }

    private function sendMail($idTemplate, $params) {
        $url = "https://api.sendinblue.com/v3/smtp/templates/" . $idTemplate . "/send";
        $curl = curl_init();
        CURL_SETOPT($curl, CURLOPT_URL, $url);
        CURL_SETOPT($curl, CURLOPT_CONNECTTIMEOUT, 30);
        CURL_SETOPT($curl, CURLOPT_TIMEOUT, 30);
        CURL_SETOPT($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($params));
        CURL_SETOPT($curl, CURLOPT_SSL_VERIFYHOST, false);
        CURL_SETOPT($curl, CURLOPT_SSL_VERIFYPEER, false);
        CURL_SETOPT($curl, CURLOPT_HTTPHEADER, ["content-type:application/json", "api-key:" . SendInBlue::API_KEY]);
        $response = curl_exec($curl);
        $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $err = curl_error($curl);
        curl_close($curl);



        return ['err' => $err, 'response' => $response, 'code' => $code];
    }

    private function formatUrl ($url) {
        return substr($url, 7);
    }
}
