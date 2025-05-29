<div class="modal" id="Modal-resize">
    <div class="modal-content">
        <button class="modal-close" data-close="modal">&times;</button>
        <div class="modal-body">
            <div class="text-center">
                <img src="{{asset('images/loader.gif')}}" alt="apperçu image" class="img-retouche" id="img-retouche">
            </div>
            <div class="btn-resize" id="resize">
                <button class="btn btn-success btn-cropper" data-crop="save">Enregistrer</button>
                <button type="button" class="btn btn-primary btn-zoom" data-method="zoom" data-option="0.1" title="Aggrandir">
                    <span class="glyphicon glyphicon-zoom-in"></span>
                </button>
                <button type="button" class="btn btn-primary btn-zoom" data-method="zoom" data-option="-0.1" title="Rétrécir">
                    <span class="glyphicon glyphicon-zoom-out"></span>
                </button>
                <button class="btn btn-danger btn-cropper" data-crop="cancel">Annuler</button>
            </div>
        </div>
    </div>
</div>