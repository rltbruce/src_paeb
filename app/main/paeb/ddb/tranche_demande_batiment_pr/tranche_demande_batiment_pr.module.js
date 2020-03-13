(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande_batiment_pr', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_demande_batiment_pr', {
            url      : '/donnees-de-base/tranche_demande_batiment_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_demande_batiment_pr/tranche_demande_batiment_pr.html',
                    controller : 'Tranche_demande_batiment_prController as vm'
                }
            },
            bodyClass: 'tranche_demande_batiment_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_demande_batiment_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_demande_batiment_pr', {
            title: 'T d_batiment pr',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_tranche_demande_batiment_pr'

        });
    }

})();
