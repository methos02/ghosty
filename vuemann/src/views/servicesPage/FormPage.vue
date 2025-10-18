<template>
  <h1 class="h1"> Service Form </h1>
  <p>
    Ce service regroupe toutes la partie liée au formulaire. Que se soit des components ou un système de validation. Vous 
    pouvez consulter la <router-link :to="{name: 'services.form.inputs'}" class="link-underline underline">liste des inputs disponible</router-link>.
  </p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25">
    <li>Importer formService dans l'objet services situé dans le fichier main.js.</li>
  </ul>
  <h3 class="h3">Dépendances</h3>
  <p>Ce service est dépedants des services :</p>
  <ul class="list ml-25">
    <li>flash - methode error</li>
    <li>locale - methode t</li>
  </ul>
  <h2 class="h2">Fonctionnement</h2>
  <p>
    La logique de la validation d'un formulaire est contenue dans un fichier de type <span class="badge-code">FormRequest</span>. 
    Ce fichier doit contenir une fonction prenant en paramètre un objet des données à valider. Dans cette fonction est défini l'ensemble 
    des règles que doivent respecter les datas. Les datas et les régles sont passées à la fonction validateForm dont le résultat est retourné.
  </p>
  <h3 class="h3">Object rules</h3>
  <p>
    Cet objet dois être instancié dans la fonction de validation et transmis à la fonction validateForm. Il contient l'ensemble des règles
    de validation de votre formulaire. Il contient une clé par nom d'input qui représente l'ensemble des règles pour cet input. L'objet des règles 
    d'input est composé de trois propriétés:
  </p>
  <ul class="list ml-25">
    <li>rules (obligatoire) - array / string : contient l'ensemble des règles appliquées à cet input.</li>
    <li>tests - objet : permet de définir des tests personnalisés pour cet input.</li>
    <li>errors - objet : permet de personnaliser les clés de traduction des erreurs pour tous les tests (prédéfinis et personnalisés).</li>
  </ul>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    le nom d'input global_tests est réservé
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <h3 class="h3">Exemple de fichier de type FormRequest</h3>
  <!-- eslint-disable -->
  <div class="div-code">
    export const validateSearchPatientForm = datas => {<br />    &emsp;const rules = {<br />    &emsp;&emsp;lastname : {<br />    &emsp;&emsp;&emsp;rules : 'required|length_check',<br />    &emsp;&emsp;&emsp;tests : {<br />    &emsp;&emsp;&emsp;&emsp;length_check: value => value.length < 3 ? 'length_check' : ''<br />    &emsp;&emsp;&emsp;}<br />    &emsp;&emsp;&emsp;errors : {<br />    &emsp;&emsp;&emsp;&emsp;length_check: 'field_lastname_short'<br />    &emsp;&emsp;&emsp;}<br />    &emsp;&emsp;},<br />    &emsp;&emsp;birthdate : {<br />    &emsp;&emsp;&emsp;rules : 'required|datePast:yyyy-mm-dd',<br />    &emsp;&emsp;&emsp;errors : {<br />    &emsp;&emsp;&emsp;&emsp;required : 'field_birthdate_required'<br />    &emsp;&emsp;&emsp;}<br />    &emsp;&emsp;},<br />    &emsp;}<br />    &emsp;<br />    &emsp;return validateForm(rules, datas)<br />    }<br />  </div>
  <!-- eslint-enable -->
  <p>
    Il y a possibilité de faire du formatage de datas avant de les transmettre à la fonction validateForm.
  </p>
  <div class="div-code">
    datas.lastname = datas.lastname.toUpperCase()<br />    <br />    return validateForm(rules, datas)
  </div>
  <h2 class="h2">Fonctionnement des tests</h2>
  <p>
    Les tests peuvent être définis de deux manières différentes :
  </p>
  <ul class="list ml-25">
    <li><strong>Tests prédéfinis</strong> : définis dans la propriété <span class="badge-code">rules</span> avec des chaînes de caractères.</li>
    <li><strong>Tests personnalisés</strong> : définis dans la propriété <span class="badge-code">tests</span> avec des fonctions.</li>
  </ul>
  <!-- eslint-disable -->
  <div class="div-code">
    lastname : {<br />    &emsp;rules : 'required|length_check',<br />    &emsp;tests : {<br />    &emsp;&emsp;length_check: value => value.length < 3 ? 'lastname_short' : ''<br />    &emsp;}<br />    },
  </div>
  <!-- eslint-enable -->
  <p>
    Il est possible de chainer les tests prédéfinis en les séparants par des <span class="badge-code">|</span>
  </p>
  <div class="div-code">
    <span class="color-neutral-500">//exemple</span><br />    lastname : {<br />    &emsp;rules : [<br />    &emsp;'required',<br />    &emsp;'date:yyyy-mm-dd'<br />    &emsp;]<br />    },<br />    <br />    <span class="color-neutral-500">//peut être écrit</span><br />    lastname : {<br />    &emsp;rules : 'required|date:yyyy-mm-dd'<br />    },
  </div>
  <p>
    Les tests prédéfinis peuvent avoir des paramètres. Dans l'exemple ci-dessous, le test prédéfini date à pour argument le 
    format de la date souhaité.
  </p>
  <div class="div-code">
    lastname : {<br />    &emsp;rules : 'date:yyyy-mm-dd'<br />    
    },
  </div>
  <p>
    Une liste des tests reprenant leur fonctionnement et les arguments requis est disponible : 
    <router-link :to="{name: 'services.form.defaultTests'}" class="link-underline underline">liste des tests</router-link>
  </p>
  <h3 class="h3">Tests personnalisés</h3>
  <p>
    Les tests personnalisés sont définis dans la propriété <span class="badge-code">tests</span> sous forme d'objet avec des fonctions.
    Chaque fonction prend deux paramètres:
  </p>
  <ul class="list ml-25">
    <li><strong>value</strong> : la data à tester</li>
    <li><strong>datas</strong> : l'ensemble des données soumis à la validation</li>
  </ul>
  <h4 class="h4">Retour</h4>
  <p>
    Si la validation échoue, il faut retourner le <strong>nom du test</strong> pour récupérer la clé de traduction correspondante dans la propriété <span class="badge-code">errors</span>, sinon une string vide.
  </p>
  <!-- eslint-disable -->
  <div class="div-code">
    <span class="color-neutral-500">//exemple avec tests personnalisés uniquement</span> <br />    lastname : {<br />    &emsp;rules : '',<br />    &emsp;tests : {<br />    &emsp;&emsp;length_check: value => value.length < 3 ? 'length_check' : ''<br />    &emsp;}<br />    &emsp;errors : {<br />    &emsp;&emsp;length_check: 'field_lastname_short'<br />    &emsp;}<br />    },<br />    <br />    <span class="color-neutral-500">//exemple avec le paramètre datas</span><br />    firstname : {<br />    &emsp;rules : '',<br />    &emsp;tests : {<br />    &emsp;&emsp;conditional_required: (value, datas) => datas.lastname && !value ? 'conditional_required' : ''<br />    &emsp;}<br />    &emsp;errors : {<br />    &emsp;&emsp;conditional_required: 'field_firstname_required_if_lastname'<br />    &emsp;}<br />    },<br />    <br />    <span class="color-neutral-500">//exemple avec tests prédéfinis ET personnalisés</span><br />    email : {<br />    &emsp;rules : 'required|email',<br />    &emsp;tests : {<br />    &emsp;&emsp;domain_check: value => value.includes('@company.com') ? '' : 'domain_check'<br />    &emsp;}<br />    &emsp;errors : {<br />    &emsp;&emsp;domain_check: 'field_email_domain_invalid'<br />    &emsp;}<br />    }<br />  </div>
  <!-- eslint-enable -->
  <h3 class="h3">Tests globaux</h3>
  <p>
    Il est possible de tester les interactions entre les inputs grace aux tests globaux. Pour cela, la clé dans l'objet rules 
    doit être <span class="badge-code">global_tests</span>.
  </p>
  <p>
    Les tests globaux sont exécutés après tous les tests individuels des inputs. Ils reçoivent l'ensemble des données du formulaire 
    et permettent de valider des règles métier complexes qui impliquent plusieurs champs.
  </p>
  
  <h4 class="h4">Structure des tests globaux</h4>
  <p>
    Les tests globaux suivent la même structure que les tests d'input individuels :
  </p>
  <ul class="list ml-25">
    <li>Ils peuvent être des chaînes de caractères (tests prédéfinis) ou des fonctions personnalisées</li>
    <li>Ils reçoivent l'ensemble des données du formulaire en paramètre</li>
    <li>Ils doivent retourner une chaîne vide si la validation réussit, ou un message d'erreur si elle échoue</li>
  </ul>
  
  <h4 class="h4">Exemple de tests globaux</h4>
  <div class="div-code">
    const rules = {<br />
    &emsp;global_tests: [<br />
    &emsp;&emsp;// Test personnalisé pour vérifier qu'un utilisateur admin ne peut pas être créé<br />
    &emsp;&emsp;datas => (datas.username === 'admin' ? 'Admin is not allowed' : ''),<br />
    &emsp;&emsp;// Test pour vérifier que si le nom de famille est présent, le prénom est requis<br />
    &emsp;&emsp;datas => (datas.lastname && !datas.firstname ? 'Le prénom est requis si le nom de famille est présent' : ''),<br />
    &emsp;&emsp;// Test pour vérifier que la date de fin est postérieure à la date de début<br />
    &emsp;&emsp;datas => {<br />
    &emsp;&emsp;&emsp;if (datas.start_date && datas.end_date) {<br />
    &emsp;&emsp;&emsp;&emsp;return new Date(datas.end_date) > new Date(datas.start_date) ? '' : 'La date de fin doit être postérieure à la date de début';<br />
    &emsp;&emsp;&emsp;}<br />
    &emsp;&emsp;&emsp;return '';<br />
    &emsp;&emsp;}<br />
    &emsp;],<br />
    &emsp;username: { rules: 'required' },<br />
    &emsp;lastname: { rules: 'required' },<br />
    &emsp;firstname: { rules: '' },<br />
    &emsp;start_date: { rules: 'date:yyyy-mm-dd' },<br />
    &emsp;end_date: { rules: 'date:yyyy-mm-dd' }<br />
    };
  </div>
  
  <h4 class="h4">Affichage des erreurs globales</h4>
  <p>
    Les erreurs des tests globaux sont stockées avec la clé <span class="badge-code">global_tests</span> dans l'objet d'erreurs. 
    Vous pouvez utiliser le composant <span class="badge-code">ErrorFormComponent</span> pour les afficher :
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// Dans votre composant Vue</span><br />
    import ErrorFormComponent from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue"<br /><br />
    <span class="color-neutral-500">// Dans le template</span><br />
    &lt;ErrorFormComponent name="global_tests" /&gt;
  </div>
  
  <h4 class="h4">Utilisation avec getError et hasError</h4>
  <p>
    Vous pouvez également vérifier et récupérer les erreurs globales avec les fonctions du service :
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// Vérifier s'il y a des erreurs globales</span><br />
    if (form.hasError('global_tests')) {<br />
    &emsp;const globalError = form.getError('global_tests');<br />
    &emsp;console.log('Erreur globale:', globalError);<br />
    }<br /><br />
    <span class="color-neutral-500">// Effacer les erreurs globales</span><br />
    form.clearError('global_tests');
  </div>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2> 
  <!-- validateForm -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>validateForm</h3>
  <p>
    Permet de vérifier un formulaire en fonction d'un objet contenant les règles attendus.
  </p>
  <h4 class="h4">Paramètres</h4>  
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>current_rules</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Objet reprenant l'ensemble des règles de validation du formulaire.
        </td>
      </tr>
      <tr>
        <td>current_datas</td>
        <td>Object</td>
        <td>oui</td>
        <td>
          Objet reprenant l'ensemble des données du formulaire.
        </td>
      </tr>
      <tr>
        <td>options</td>
        <td>Object</td>
        <td>non</td>
        <td>
          Options de validation.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Options</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>form</td>
        <td>string</td>
        <td> undefined </td>
        <td>
          Permet de spécifier le nom du formulaire et de modifier le nom des inputs et des erreurs.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>
  <div class="div-code">
  {<br />  &emsp;valide : bool,<br />  &emsp;datas : object,<br />  &emsp;errors : object (default {})<br />  }
  </div>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />   
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    <br />          
    servicesM.service('form:validateForm', [current_rules, current_datas])<br /><br />    
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { validateForm } from "@brugmann/vuemann/src/services/services-helper.js"<br />          
    validateForm(current_rules, current_datas)<br />  
  </div> 
  <!-- getErrors -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getErrors</h3>
  <p>
    Retourne l'ensemble des erreurs du formulaire.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />   
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />          
    servicesM.service('form:getErrors')<br />  <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { form } from "@brugmann/vuemann/src/services/services-helper.js"<br />         
    form.getErrors()<br />  
  </div>
  <!-- getError -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getError</h3>
  <p>
    Retourne l'erreur d'un input.
  </p>
  <h4 class="h4">Paramètres</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>input_name</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Nom de l'input.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />   
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />          
    servicesM.service('form:getError', [input_name])<br />  <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { form } from "@brugmann/vuemann/src/services/services-helper.js"<br />         
    form.getError(input_name)<br />  
  </div>
  <!-- hasError -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>hasError</h3>
  <p>
    Retourne true si l'input a une erreur.
  </p>
  <h4 class="h4">Paramètres</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>input_name</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Nom de l'input.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />   
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />          
    servicesM.service('form:hasError', [input_name])<br />  <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { form } from "@brugmann/vuemann/src/services/services-helper.js"<br />         
    form.hasError(input_name)<br />  
  </div>
  <!-- clearError -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>clearError</h3>
  <p>
    Supprime l'erreur d'un input.
  </p>  
  <h4 class="h4">Paramètres</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>input_name</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Nom de l'input.
        </td>
      </tr>
    </tbody>
  </table>  
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />   
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />          
    servicesM.service('form:clearError', [input_name])<br />  <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { form } from "@brugmann/vuemann/src/services/services-helper.js"<br />         
    form.clearError(input_name)<br />  
  </div>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>clearErrors</h3>
  <p>
    Supprime toutes les erreurs du formulaire.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />   
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />          
    servicesM.service('form:clearErrors')<br />  <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { form } from "@brugmann/vuemann/src/services/services-helper.js"<br />         
    form.clearErrors()<br />  
  </div>
  <h2 class="h2">Affichage des erreurs</h2>
  <p>
    Le service form fournit un composant <span class="badge-code">ErrorFormComponent</span> pour afficher tous types d'erreurs de formulaire.
  </p>
  
  <h3 class="h3">Installation du composant</h3>
  <div class="div-code">
    <span class="color-neutral-500">// Dans votre composant Vue</span><br />
    import ErrorFormComponent from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue"
  </div>
  
  <h3 class="h3">Utilisation du composant</h3>
  <p>
    <span class="badge-code">ErrorFormComponent</span> peut être utilisé pour afficher différents types d'erreurs :
  </p>
  
  <h4 class="h4">Erreurs d'input individuels</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Dans le template</span><br />
    &lt;input type="text" name="username" /&gt;<br />
    &lt;ErrorFormComponent name="username" /&gt;
  </div>
  
  <h4 class="h4">Erreurs globales</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Dans le template</span><br />
    &lt;ErrorFormComponent name="global_tests" /&gt;
  </div>
  
  <h4 class="h4">Erreurs personnalisées</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Dans le template</span><br />
    &lt;ErrorFormComponent name="custom_error" /&gt;
  </div>
  
  <h3 class="h3">Inclusion automatique dans les composants</h3>
  <p>
    Le composant <span class="badge-code">ErrorFormComponent</span> est automatiquement inclus dans tous les composants d'input du service form.
  </p>
  <p>
    Cela signifie que vous n'avez pas besoin d'ajouter manuellement <span class="badge-code">ErrorFormComponent</span> 
    lorsque vous utilisez les composants du service form. Les erreurs s'afficheront automatiquement en dessous du champ correspondant.
  </p>
  
  <h4 class="h4">Exemple avec composants du service form</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Les erreurs s'affichent automatiquement</span><br />
    &lt;Input name="username" /&gt;<br />
    &lt;Select name="country" :options="countries" /&gt;<br />
    &lt;InputSearch name="search" /&gt;<br />
    &lt;InputDate name="birthdate" /&gt;<br />
    &lt;Textarea name="description" /&gt;<br />
    &lt;Switch name="active" /&gt;<br /><br />
    <span class="color-neutral-500">// Pas besoin d'ajouter ErrorFormComponent manuellement</span><br />
    <span class="color-neutral-500">// Les erreurs s'affichent automatiquement sous chaque champ</span>
  </div>
  
  <h4 class="h4">Utilisation manuelle d'ErrorFormComponent</h4>
  <p>
    Vous devez utiliser <span class="badge-code">ErrorFormComponent</span> manuellement uniquement pour :
  </p>
  <ul class="list ml-25">
    <li>Les erreurs globales (<span class="badge-code">name="global_tests"</span>)</li>
    <li>Les erreurs personnalisées non liées à un champ spécifique</li>
    <li>Les champs HTML natifs (input, select, etc.) non encapsulés dans les composants du service</li>
  </ul>
</template>
