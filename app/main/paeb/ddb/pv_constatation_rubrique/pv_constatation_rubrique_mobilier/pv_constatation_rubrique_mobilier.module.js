(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.pv_constatation_rubrique.pv_constatation_rubrique_mobilier', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_pv_constatation_rubrique_pv_constatation_rubrique_mobilier', {
            url      : '/donnees-de-base/pv_constatation_rubrique_mobilier',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/pv_constatation_rubrique/pv_constatation_rubrique_mobilier/pv_constatation_rubrique_mobilier.html',
                    controller : 'Pv_constatation_rubrique_mobilierController as vm'
                }
            },
            bodyClass: 'pv_constatation_rubrique_mobilier',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "pv_constatation_rubrique_mobilier"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.pv_constatation_rubrique.pv_constatation_rubrique_mobilier', {
            title: 'Mobilier',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_pv_constatation_rubrique_pv_constatation_rubrique_mobilier',
            weight: 1
        });
    }

})();
