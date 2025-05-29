<form name="paginateur" class="div-navigation" data-roman="{{$roman->id}}">
    <button class="{{ $chapitre->order == 1? ' maximum' : ''}}" {{ $chapitre->order == 1? 'disabled="disabled"' : ''}} data-lecture="moins"><span class="glyphicon glyphicon-chevron-left"></span></button>
    <label><input type="text" data-order placeholder="{{ $chapitre->order }}"></label> /
    <span data-nbmax> {{ $roman->nb_suite }} </span>
    <button class="{{ $chapitre->order == $roman->nb_suite? ' maximum' : ''}}" {{ $chapitre->order == $roman->nb_suite? 'disabled="disabled"' : ''}} data-lecture="plus"><span class="glyphicon glyphicon-chevron-right"></span></button>
</form>