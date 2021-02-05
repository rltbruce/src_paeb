(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.organe_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_organe_feffi', {
            url      : '/donnees-de-base/organe_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/organe_feffi/organe_feffi.html',
                    controller : 'Organe_feffiController as vm'
                }
            },
            bodyClass: 'organe_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "organe_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.organe_feffi', {
            title: 'Organe FEFFI',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_organe_feffi',
            weight: 17
        });
    }

})();
