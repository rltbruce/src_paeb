(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande.tranche_moe', [
            'app.paeb.ddb.tranche_demande.tranche_moe.tranche_d_debut_travaux_moe',
            'app.paeb.ddb.tranche_demande.tranche_moe.tranche_demande_batiment_moe',
            'app.paeb.ddb.tranche_demande.tranche_moe.tranche_demande_latrine_moe',
            'app.paeb.ddb.tranche_demande.tranche_moe.tranche_d_fin_travaux_moe',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_demande.tranche_moe', {
            title : 'Bureau etude',
            icon  : 'icon-view-stream'
        });
    }

})();
