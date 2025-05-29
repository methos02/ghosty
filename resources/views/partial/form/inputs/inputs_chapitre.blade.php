<div class="uform">
    <div class="row-flex">
        {!! FormCustom::titre('titre_chapitre', 'Titre du chapitre', ['obliger' => 1, 'width' => 'order', 'disabled' => $brouillon == 'roman_empty']) !!}
        <?php if(isset($_POST['id_oeuvre'], $brouillon) && $brouillon['oeu_order'] != 1) :?>
        <div class="col-md-4">
            <label for="mode">
                <input name="end" type="checkbox" value="1" <?php echo ((!empty($brouillon['oeu_end']) && $brouillon['oeu_end'] == 1)? 'checked="checked"': '') ?>>
                Chapitre final
            </label>
        </div>
        <?php endif; ?>
    </div>
    <div class="row-flex">
        <a href="" class="btn-ghosty btn-neg-native btn-uform-select" data-btn_uform="recit">Récit</a>
        <a href="" class="btn-ghosty btn-neg-native" data-btn_uform="resume">Résumé</a>
        @if($form == 'roman')
            <a href=""  class="btn-ghosty btn-neg-native" data-btn_uform="cover">Couverture <span class="btn-cover">(facultatif)</span></a>
        @endif
    </div>
    <div class="row-flex" data-uform="recit">
        {!! FormCustom::text('recit', 'Récit', ['obliger' => 1, 'height' => 300, 'width' => 'order', 'disabled' => $brouillon == 'roman_empty']) !!}
    </div>
    <div class="row-flex row-column" data-uform="resume" style="display: none">
        {!! FormCustom::text('resume', 'Résumé', ['obliger' => 1, 'height' => 256, 'width' => 'order', 'compteur' => 500, 'disabled' => $brouillon == 'roman_empty']) !!}
    </div>
</div>
