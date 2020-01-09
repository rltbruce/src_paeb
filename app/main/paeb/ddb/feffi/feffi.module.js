(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_feffi', {
            url      : '/donnees-de-base/feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/feffi/feffi.html',
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
        msNavigationServiceProvider.saveItem('paeb.ddb.feffi', {
            title: 'Feffi',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_ddb_feffi',
			weight: 3
        });
    }

})();
