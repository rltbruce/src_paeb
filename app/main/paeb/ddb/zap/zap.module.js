(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.zap', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_zap', {
            url      : '/donnees-de-base/zap',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/zap/zap.html',
                    controller : 'ZapController as vm'
                }
            },
            bodyClass: 'zap',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "zap"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.zap', {
            title: 'zap',
            icon  : 'icon-school',
            state: 'app.paeb_ddb_zap',
            weight: 2
        });
    }

})();
