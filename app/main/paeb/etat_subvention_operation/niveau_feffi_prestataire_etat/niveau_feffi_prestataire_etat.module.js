(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_feffi_prestataire_etat', [
            'app.paeb.etat_subvention_operation.niveau_feffi_prestataire_etat.convention_suivi_bcaf_etat',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_feffi_prestataire_etat', {
            title : 'Niveau FEFFI/PRESTATAIRE',
            icon  : 'icon-black-mesa',
            weight: 3
        });



    }

})();
