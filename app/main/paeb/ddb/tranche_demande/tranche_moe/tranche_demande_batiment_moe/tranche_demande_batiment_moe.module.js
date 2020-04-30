(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande.tranche_moe.tranche_demande_batiment_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_demande_tranche_moe_tranche_demande_batiment_moe', {
            url      : '/donnees-de-base/tranche_demande_batiment_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_demande/tranche_moe/tranche_demande_batiment_moe/tranche_demande_batiment_moe.html',
                    controller : 'Tranche_demande_batiment_moeController as vm'
                }
            },
            bodyClass: 'tranche_demande_batiment_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_demande_batiment_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_demande.tranche_moe.tranche_demande_batiment_moe', {
            title: 'Batiment',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_tranche_demande_tranche_moe_tranche_demande_batiment_moe'

        });
    }

})();
