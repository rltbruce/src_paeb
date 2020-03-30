(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_mpe.tranche_demande_latrine_mpe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_mpe_tranche_demande_latrine_mpe', {
            url      : '/donnees-de-base/tranche_demande_latrine_mpe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_mpe/tranche_demande_latrine_mpe/tranche_demande_latrine_mpe.html',
                    controller : 'Tranche_demande_latrine_mpeController as vm'
                }
            },
            bodyClass: 'tranche_demande_latrine_mpe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_demande_latrine_mpe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_mpe.tranche_demande_latrine_mpe', {
            title: 'Tranche latrine',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_tranche_mpe_tranche_demande_latrine_mpe'

        });
    }

})();
