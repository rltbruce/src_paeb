(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande', [
            'app.paeb.ddb.tranche_demande.tranche_d_debut_travaux_pr',
            'app.paeb.ddb.tranche_demande.tranche_deblocage_daaf',
            'app.paeb.ddb.tranche_demande.tranche_deblocage_feffi',
            //'app.paeb.ddb.tranche_demande.tranche_moe',
            'app.paeb.ddb.tranche_demande.tranche_mpe',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_demande', {
            title : 'Tranche demande',
            icon  : 'icon-format-list-numbers',
            weight: 10
        });
    }

})();
