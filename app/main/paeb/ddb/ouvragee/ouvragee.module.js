(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.ouvragee', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_ouvragee', {
            url      : '/donnees-de-base/ouvragee',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/ouvragee/ouvragee.html',
                    controller : 'OuvrageeController as vm'
                }
            },
            bodyClass: 'ouvragee',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ouvragee"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.ouvragee', {
            title: 'Ouvragee',
            icon  : 'icon-tile-four',
            state: 'app.paeb_ddb_ouvragee',
			weight: 2
        });
    }

})();
