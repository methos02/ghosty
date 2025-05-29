<?php

namespace App\Http\Controllers;

use App\chapitre;
use App\Http\Requests\chapitreOrderRequest;
use App\Http\Requests\chapitreSlugRequest;
use App\Http\Requests\infosRequest;
use App\Repositories\ChapitreRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChapitreController extends Controller {

    private $chapitreR;

    public function __construct(ChapitreRepository $chapitreR)  {
        $this->chapitreR = $chapitreR;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return Response
     */
    public function show($slug) {
        $chapitre = $this->chapitreR->getBySlug($slug);
        $roman = $chapitre->roman;

        return view( 'chapitre.show' , compact('chapitre', 'roman'));
    }

    public function infos(infosRequest $request) {
        $chapitre = $this->chapitreR->getBySlug($request->input('slug'));

        return view ('chapitre.info', compact( 'chapitre'));
    }


    /**
     * @param chapitreOrderRequest $request
     * @return void
     */
    public function jsonOrder(chapitreOrderRequest $request) {
        $chapitre = $this->chapitreR->getByOrder($request->input('id_roman'), $request->input('order'));
        $chapitre->writer = $chapitre->user->pseudo;

        return response()->json($chapitre);
    }

    /**
     * @param chapitreSlugRequest $request
     * @return void
     */
    public function jsonSlug(chapitreSlugRequest $request) {
        $chapitre = $this->chapitreR->getBySlug($request->input('slug'));
        $chapitre->writer = $chapitre->user->pseudo;

        return response()->json($chapitre);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param chapitre $chapitre
     * @return Response
     */
    public function edit(chapitre $chapitre)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param chapitre $chapitre
     * @return Response
     */
    public function update(Request $request, chapitre $chapitre)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param chapitre $chapitre
     * @return Response
     */
    public function destroy(chapitre $chapitre)
    {
        //
    }
}
