(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_d_debut_travaux_pr', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_d_debut_travaux_pr', {
            url      : '/donnees-de-base/tranche_d_debut_travaux_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_d_debut_travaux_pr/tranche_d_debut_travaux_pr.html',
                    controller : 'Tranche_d_debut_travaux_prController as vm'
                }
            },
            bodyClass: 'tranche_d_debut_travaux_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_d_debut_travaux_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_d_debut_travaux_pr', {
            title: 'Tranche demande PR',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_tranche_d_debut_travaux_pr'

        });
    }

})();
