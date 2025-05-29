<?php

namespace App\Http\Controllers;

use App\Http\Requests\NotifArrayRequest;
use App\Http\Requests\NotifShowRequest;
use App\Notif;
use App\Repositories\NotifRepository;
use App\Repositories\UserRepository;
use Auth;
use Illuminate\Http\Response;

class NotifController extends Controller {

    private $notifR;
    private $userR;

    public function __construct(NotifRepository $notifR, UserRepository $userR)  {
        $this->notifR = $notifR;
        $this->userR = $userR;

        $this->middleware('verified')->except('mailValidate');
        $this->middleware('ajax', ['only' => 'show']);
    }

    public function index() {
        $notifs = Auth::user()->notifUndelete();
        return view( 'notif.index' , compact('notifs'));
    }

    public function corbeille() {
        $notifs = Auth::user()->notifDelete();
        return view( 'notif.corbeille' , compact('notifs'));
    }

    /**
     * Display the specified resource.
     *
     * @param NotifShowRequest $request
     * @return Response
     */
    public function show(NotifShowRequest $request) {
        $notif = $this->notifR->getById($request->input('id_notif'));

        if($notif->statut == Notif::S_NEW) {
            $notif->statutView();
            $this->userR->decreaseNotif();
        }

        return view( 'notif.show' , compact('notif'));
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param NotifArrayRequest $request
     * @return void
     */
    public function delete(NotifArrayRequest $request) {
        $nbNew = $this->notifR->determineCountNewNotif($request->input('ids_notif'));
        $this->notifR->deleteById($request->input('ids_notif'));
        $this->userR->decreaseNotif($nbNew);

        return response()->json(
            ['message' => count($request->input('ids_notif')) != 1 ? 'Les notifications ont bien été supprimées.' : 'La notification a bien été supprimée.'],
            200
        );
    }

    public function recup(NotifArrayRequest $request) {
        $this->notifR->recupById($request->input('ids_notif'));

        return response()->json(
            ['message' => count($request->input('ids_notif')) != 1 ? 'Les notifications ont bien été récupérées.' : 'La notification a bien été récupérée.'],
            200
        );
    }

    public function destroy(NotifArrayRequest $request) {
        $this->notifR->destroyById($request->input('ids_notif'));

        return response()->json(
            ['message' => 'La corbeille a bien été vidée.'],
            200
        );
    }
}
