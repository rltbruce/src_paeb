(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.acces_zone', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_acces_zone', {
            url      : '/donnees-de-base/acces_zone',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/acces_zone/acces_zone.html',
                    controller : 'Acces_zoneController as vm'
                }
            },
            bodyClass: 'acces_zone',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Acces_zone"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.acces_zone', {
            title: 'Acces zone',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_acces_zone',
			weight: 5
        });
    }

})();
