(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_moe.tranche_demande_latrine_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_moe_tranche_demande_latrine_moe', {
            url      : '/donnees-de-base/tranche_moe/tranche_demande_latrine_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_moe/tranche_demande_latrine_moe/tranche_demande_latrine_moe.html',
                    controller : 'Tranche_demande_latrine_moeController as vm'
                }
            },
            bodyClass: 'tranche_demande_latrine_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_demande_latrine_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_moe.tranche_demande_latrine_moe', {
            title: 'Latrine',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_tranche_moe_tranche_demande_latrine_moe'

        });
    }

})();
