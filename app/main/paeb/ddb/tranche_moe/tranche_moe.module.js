(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_moe', [
            'app.paeb.ddb.tranche_moe.tranche_d_debut_travaux_moe',
            'app.paeb.ddb.tranche_moe.tranche_demande_batiment_moe',
            'app.paeb.ddb.tranche_moe.tranche_demande_latrine_moe',
            'app.paeb.ddb.tranche_moe.tranche_d_fin_travaux_moe',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_moe', {
            title : 'Tranche D_MOE',
            icon  : 'icon-map-marker-multiple'
        });
    }

})();
