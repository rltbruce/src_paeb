(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.pv_constatation_rubrique.pv_constatation_rubrique_latrine', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_pv_constatation_rubrique_pv_constatation_rubrique_latrine', {
            url      : '/donnees-de-base/pv_constatation_rubrique_latrine',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/pv_constatation_rubrique/pv_constatation_rubrique_latrine/pv_constatation_rubrique_latrine.html',
                    controller : 'Pv_constatation_rubrique_latrineController as vm'
                }
            },
            bodyClass: 'pv_constatation_rubrique_latrine',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "pv_constatation_rubrique_latrine"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.pv_constatation_rubrique.pv_constatation_rubrique_latrine', {
            title: 'Latrine',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_pv_constatation_rubrique_pv_constatation_rubrique_latrine',
            weight: 1
        });
    }

})();
