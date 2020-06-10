(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire', [
            'app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf',
            'app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_dpfi'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)//Suivi DAAF/UFP
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_prestataire', {
            title : 'Niveau FEFFI/PRESTATAIRE',
            icon  : 'icon-data',
            weight: 6
        });

    }

})();
