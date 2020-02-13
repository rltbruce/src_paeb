(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.ecole', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_ecole', {
            url      : '/donnees-de-base/ecole',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/ecole/ecole.html',
                    controller : 'EcoleController as vm'
                }
            },
            bodyClass: 'ecole',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ecole"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.ecole', {
            title: 'Ecole',
            icon  : 'icon-home-variant',
            state: 'app.paeb_ddb_ecole',
			weight: 4
        });
    }

})();
