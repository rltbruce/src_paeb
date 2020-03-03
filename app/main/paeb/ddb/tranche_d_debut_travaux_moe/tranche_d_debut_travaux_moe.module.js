(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_d_debut_travaux_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_d_debut_travaux_moe', {
            url      : '/donnees-de-base/tranche_d_debut_travaux_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_d_debut_travaux_moe/tranche_d_debut_travaux_moe.html',
                    controller : 'Tranche_d_debut_travaux_moeController as vm'
                }
            },
            bodyClass: 'tranche_d_debut_travaux_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_d_debut_travaux_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_d_debut_travaux_moe', {
            title: 'T d_travaux moe',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_tranche_d_debut_travaux_moe'

        });
    }

})();
