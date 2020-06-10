(function ()
{
    'use strict';

    angular
        .module('app.paeb.convention_suivi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_convention_suivi', {
            url      : '/donnees-de-base/convention_suivi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/convention_suivi/convention_suivi.html',
                    controller : 'Convention_suiviController as vm'
                }
            },
            bodyClass: 'convention_suivi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.convention_suivi', {
            title: 'Suivi convention',
            icon  : 'icon-tile-four',
            state: 'app.paeb_convention_suivi',
			weight: 1
        });
    }

})();
