(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.pv_constatation_rubrique.pv_constatation_rubrique_batiment', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_pv_constatation_rubrique_pv_constatation_rubrique_batiment', {
            url      : '/donnees-de-base/pv_constatation_rubrique_batiment',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/pv_constatation_rubrique/pv_constatation_rubrique_batiment/pv_constatation_rubrique_batiment.html',
                    controller : 'Pv_constatation_rubrique_batimentController as vm'
                }
            },
            bodyClass: 'pv_constatation_rubrique_batiment',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "pv_constatation_rubrique_batiment"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.pv_constatation_rubrique.pv_constatation_rubrique_batiment', {
            title: 'Batiment',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_pv_constatation_rubrique_pv_constatation_rubrique_batiment',
            weight: 1
        });
    }

})();
