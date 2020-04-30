(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_feffi', {
            url      : '/donnees-de-base/feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/feffi/feffi.html',
                    controller : 'FeffiController as vm'
                }
            },
            bodyClass: 'feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.feffi', {
            title: 'Renseignement FEFFI',
            icon  : 'icon-quadcopter',
            state: 'app.paeb_gerer_situation_feffi_feffi',
			weight: 3
        });
    }

})();
