<template>
  <h1 class="h1">Tests de Validation par Défaut</h1>
  <p>
    Le système de formulaires Vuemann fournit un ensemble complet de tests de validation prêts à l'emploi. 
    Ces tests permettent de valider automatiquement les données des formulaires selon des règles métier définies.
  </p>

  <h2 class="h2">Tests de Base</h2>
  
  <h3 class="h3">`required`</h3>
  <p>Valide qu'un champ est obligatoire.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const result = tests.required('')           // Retourne 'field_required'<br />
    const result = tests.required('valeur')     // Retourne '' (valide)<br />
    const result = tests.required(null)         // Retourne 'field_required'<br />
    const result = tests.required(undefined)    // Retourne 'field_required'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'field_name': 'required'<br />
    'field_name': 'required|min:5|max:100'
  </div>

  <h3 class="h3">`in`</h3>
  <p>Valide qu'une valeur est présente dans une liste d'options.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = { options: 'option1,option2,option3' }<br />
    const result = tests.in('option1', options)     // Retourne '' (valide)<br />
    const result = tests.in('option4', options)     // Retourne 'field_in:in#option1,option2,option3'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'status': 'in:active,inactive,pending'<br />
    'category': 'in:urgent,normal,low'
  </div>

  <h2 class="h2">Tests Numériques</h2>
  
  <h3 class="h3">`integer`</h3>
  <p>Valide qu'une valeur est un entier valide.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const result = tests.integer('123')         // Retourne '' (valide)<br />
    const result = tests.integer('12.34')       // Retourne 'field_invalid'<br />
    const result = tests.integer('abc')         // Retourne 'field_invalid'<br />
    const result = tests.integer('-123')        // Retourne 'field_invalid'<br />
    const result = tests.integer('')            // Retourne 'field_invalid'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'quantity': 'integer'<br />
    'age': 'integer'
  </div>

  <h3 class="h3">`positive`</h3>
  <p>Valide qu'une valeur est un entier strictement positif (exclut zéro).</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const result = tests.positive('123')        // Retourne '' (valide)<br />
    const result = tests.positive('0')          // Retourne 'field_invalid'<br />
    const result = tests.positive('-123')       // Retourne 'field_invalid'<br />
    const result = tests.positive('12.34')      // Retourne 'field_invalid'<br />
    const result = tests.positive('abc')        // Retourne 'field_invalid'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'quantity': 'positive'<br />
    'price': 'positive'
  </div>

  <h3 class="h3">`min`</h3>
  <p>Valide qu'une valeur numérique est supérieure ou égale à une valeur minimale.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = { options: '5' }<br />
    const result = tests.min('10', options)     // Retourne '' (valide)<br />
    const result = tests.min('5', options)      // Retourne '' (valide)<br />
    const result = tests.min('3', options)      // Retourne 'field_min:min#5'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'age': 'min:18'<br />
    'quantity': 'min:1'<br />
    'price': 'min:0'
  </div>

  <h3 class="h3">`max`</h3>
  <p>Valide qu'une valeur numérique est inférieure ou égale à une valeur maximale.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = { options: '100' }<br />
    const result = tests.max('50', options)     // Retourne '' (valide)<br />
    const result = tests.max('100', options)    // Retourne '' (valide)<br />
    const result = tests.max('150', options)    // Retourne 'field_max:max#100'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'age': 'max:120'<br />
    'quantity': 'max:999'<br />
    'price': 'max:10000'
  </div>

  <h2 class="h2">Tests de Dates</h2>
  
  <h3 class="h3">`date`</h3>
  <p>Valide le format d'une date selon un format spécifié.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = 'DD/MM/YYYY'<br />
    const result = tests.date('17/12/2024', options)    // Retourne '' (valide)<br />
    const result = tests.date('invalid', options)        // Retourne message d'erreur
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'birthDate': 'date:DD/MM/YYYY'<br />
    'startDate': 'date:YYYY-MM-DD'
  </div>

  <h3 class="h3">`datePast`</h3>
  <p>Valide qu'une date est dans le passé.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = 'DD/MM/YYYY'<br />
    const result = tests.datePast('15/01/2020', options) // Retourne '' (valide)<br />
    const result = tests.datePast('17/12/2025', options) // Retourne message d'erreur
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'birthDate': 'datePast:DD/MM/YYYY'<br />
    'startDate': 'datePast:YYYY-MM-DD'
  </div>

  <h3 class="h3">`dateFutur`</h3>
  <p>Valide qu'une date est dans le futur.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = 'DD/MM/YYYY'<br />
    const result = tests.dateFutur('17/12/2025', options) // Retourne '' (valide)<br />
    const result = tests.dateFutur('15/01/2020', options) // Retourne message d'erreur
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'appointmentDate': 'dateFutur:DD/MM/YYYY'<br />
    'endDate': 'dateFutur:YYYY-MM-DD'
  </div>

  <h2 class="h2">Tests de Taille</h2>
  
  <h3 class="h3">`size`</h3>
  <p>Valide qu'une chaîne a exactement la taille spécifiée.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = '4'<br />
    const result = tests.size('test', { options })       // Retourne '' (valide)<br />
    const result = tests.size('testing', { options })    // Retourne 'field_size_equal:size#4'<br />
    const result = tests.size('te', { options })         // Retourne 'field_size_equal:size#4'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'code': 'size:4'<br />
    'pin': 'size:6'
  </div>

  <h3 class="h3">`sizeMin`</h3>
  <p>Valide qu'une chaîne a une taille minimale.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = 5<br />
    const result = tests.sizeMin('testing', { options }) // Retourne '' (valide)<br />
    const result = tests.sizeMin('test', { options })    // Retourne 'field_size_min:size#5'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'password': 'sizeMin:8'<br />
    'description': 'sizeMin:10'
  </div>

  <h3 class="h3">`sizeMax`</h3>
  <p>Valide qu'une chaîne a une taille maximale.</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const options = 10<br />
    const result = tests.sizeMax('short', { options })   // Retourne '' (valide)<br />
    const result = tests.sizeMax('very long text', { options }) // Retourne 'field_size_max:size#10'
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'username': 'sizeMax:20'<br />
    'comment': 'sizeMax:500'
  </div>

  <h2 class="h2">Tests Belges</h2>
  
  <h3 class="h3">`niss`</h3>
  <p>Valide un numéro de sécurité sociale belge (NISS).</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const result = tests.niss('12345678901')    // Retourne '' (valide)<br />
    const result = tests.niss('invalid')        // Retourne message d'erreur
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'socialSecurityNumber': 'niss'
  </div>

  <h3 class="h3">`biss`</h3>
  <p>Valide un numéro de registre national belge (BISS).</p>
  <div class="div-code">
    <span class="color-neutral-500">// Validation</span><br />
    const result = tests.biss('12345678901')    // Retourne '' (valide)<br />
    const result = tests.biss('invalid')        // Retourne message d'erreur
  </div>
  <p><strong>Usage dans un formulaire :</strong></p>
  <div class="div-code">
    'nationalNumber': 'biss'
  </div>

  <h2 class="h2">Combinaison de Règles</h2>
  <p>
    Les tests peuvent être combinés avec le séparateur <span class="badge-code">|</span> :
  </p>
  <div class="div-code">
    const formRules = {<br />
    &emsp;// Champ obligatoire avec validation numérique<br />
    &emsp;'quantity': 'required|integer|min:1|max:100',<br />
    &emsp;<br />
    &emsp;// Champ obligatoire avec validation de date<br />
    &emsp;'birthDate': 'required|datePast:DD/MM/YYYY',<br />
    &emsp;<br />
    &emsp;// Champ avec validation de taille et format<br />
    &emsp;'username': 'required|sizeMin:3|sizeMax:20',<br />
    &emsp;<br />
    &emsp;// Champ avec validation d'options<br />
    &emsp;'status': 'required|in:active,inactive,pending',<br />
    &emsp;<br />
    &emsp;// Champ avec validation complexe<br />
    &emsp;'price': 'required|positive|min:0|max:10000'<br />
    }
  </div>

  <h2 class="h2">Exécution des Tests</h2>
  <div class="div-code">
    import { defaultTests } from '@/services/form/src/default-tests-form.js'<br />
    <br />
    // Exécution d'un test simple<br />
    const result = defaultTests.execute('required', 'valeur', {})<br />
    <br />
    // Exécution d'un test avec options<br />
    const result = defaultTests.execute('min:5', '3', {})<br />
    <br />
    // Exécution d'un test avec format de date<br />
    const result = defaultTests.execute('date:DD/MM/YYYY', '17/12/2024', {})
  </div>

  <h2 class="h2">Messages d'Erreur</h2>
  <p>Les messages d'erreur suivent un format standardisé :</p>
  <ul class="list ml-25">
    <li><strong>Champ requis</strong> : <span class="badge-code">field_required</span></li>
    <li><strong>Valeur invalide</strong> : <span class="badge-code">field_invalid</span></li>
    <li><strong>Valeur hors limites</strong> : <span class="badge-code">field_min:min#[valeur]</span> ou <span class="badge-code">field_max:max#[valeur]</span></li>
    <li><strong>Taille incorrecte</strong> : <span class="badge-code">field_size_equal:size#[valeur]</span>, <span class="badge-code">field_size_min:size#[valeur]</span>, <span class="badge-code">field_size_max:size#[valeur]</span></li>
    <li><strong>Valeur non autorisée</strong> : <span class="badge-code">field_in:in#[options]</span></li>
    <li><strong>Date invalide</strong> : Messages spécifiques aux tests de date</li>
  </ul>

  <h3 class="h3">Personnalisation des Messages</h3>
  <p>Les messages peuvent être personnalisés via le système de traduction de l'application :</p>
  <div class="div-code">
    // Dans les fichiers de traduction<br />
    {<br />
    &emsp;"field_required": "Ce champ est obligatoire",<br />
    &emsp;"field_invalid": "Cette valeur n'est pas valide",<br />
    &emsp;"field_min": "La valeur doit être au moins {min}",<br />
    &emsp;"field_max": "La valeur ne peut pas dépasser {max}",<br />
    &emsp;"field_size_equal": "La taille doit être exactement {size} caractères",<br />
    &emsp;"field_size_min": "La taille doit être d'au moins {size} caractères",<br />
    &emsp;"field_size_max": "La taille ne peut pas dépasser {size} caractères"<br />
    }
  </div>

  <h2 class="h2">Bonnes Pratiques</h2>
  
  <h3 class="h3">1. Ordre des Règles</h3>
  <p>Toujours placer les règles dans un ordre logique :</p>
  <div class="div-code">
    // ✅ Bon ordre : requis → type → contraintes<br />
    'field': 'required|integer|min:1|max:100'<br />
    <br />
    // ❌ Ordre confus : contraintes avant type<br />
    'field': 'min:1|max:100|required|integer'
  </div>

  <h3 class="h3">2. Validation des Données</h3>
  <div class="div-code">
    // ✅ Validation complète<br />
    const rules = {<br />
    &emsp;'age': 'required|integer|min:0|max:120',<br />
    &emsp;'email': 'required|email',<br />
    &emsp;'startDate': 'required|dateFutur:DD/MM/YYYY'<br />
    }<br />
    <br />
    // ❌ Validation insuffisante<br />
    const rules = {<br />
    &emsp;'age': 'required',<br />
    &emsp;'email': 'required',<br />
    &emsp;'startDate': 'required'<br />
    }
  </div>

  <h3 class="h3">3. Gestion des Erreurs</h3>
  <div class="div-code">
    // ✅ Gestion appropriée des erreurs<br />
    const result = defaultTests.execute('min:5', '3', {})<br />
    if (result) {<br />
    &emsp;// Afficher l'erreur à l'utilisateur<br />
    &emsp;showflash.error(result)<br />
    }<br />
    <br />
    // ❌ Ignorer les erreurs<br />
    const result = defaultTests.execute('min:5', '3', {})<br />
    // Pas de gestion d'erreur
  </div>

  <h2 class="h2">Conclusion</h2>
  <p>
    Le système de tests par défaut de Vuemann fournit une base solide et extensible pour la validation des formulaires. 
    En combinant ces tests avec des règles métier personnalisées, vous pouvez créer des formulaires robustes et maintenables.
  </p>

</template>

<script setup>
// Pas de logique complexe nécessaire pour cette page de documentation
</script>

<style scoped>
.default-tests-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
