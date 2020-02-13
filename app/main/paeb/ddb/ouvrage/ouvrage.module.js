(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.ouvrage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_ouvrage', {
            url      : '/donnees-de-base/ouvrage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/ouvrage/ouvrage.html',
                    controller : 'OuvrageController as vm'
                }
            },
            bodyClass: 'ouvrage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ouvrage"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.ouvrage', {
            title: 'Ouvrage',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_ouvrage',
			weight: 5
        });
    }

})();
