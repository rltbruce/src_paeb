(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_prestataire_etat', [
            'app.paeb.etat_subvention_financiere.niveau_feffi_prestataire_etat.convention_suivi_fp_bcaf_etat'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)//Suivi DAAF/UFP
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_feffi_prestataire_etat', {
            title : 'Niveau FEFFI/PRESTATAIRE',
            icon  : 'icon-flattr',
            weight: 6
        });

    }

})();
