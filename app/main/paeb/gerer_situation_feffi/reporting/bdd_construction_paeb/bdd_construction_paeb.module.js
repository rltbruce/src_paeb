(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.reporting.bdd_construction_paeb', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_reporting_bdd_construction_paeb', {
            url      : '/donnees-de-base/bdd_construction_paeb',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/reporting/bdd_construction_paeb/bdd_construction_paeb.html',
                    controller : 'Bdd_construction_paebController as vm'
                }
            },
            bodyClass: 'bdd_construction_paeb',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "bdd_construction_paeb"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.reporting.bdd_construction_paeb', {
            title: 'Bdd construction',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_feffi_reporting_bdd_construction_paeb',
			weight: 1
        });
    }

})();
