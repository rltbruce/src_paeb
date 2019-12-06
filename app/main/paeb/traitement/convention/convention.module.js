(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.convention', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_traitement_convention', {
            url      : '/donnees-de-base/convention',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/traitement/convention/convention.html',
                    controller : 'ConventionController as vm'
                }
            },
            bodyClass: 'convention',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Convention"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.traitement.convention', {
            title: 'Convention',
            icon  : 'icon-tile-four',
            state: 'app.paeb_traitement_convention',
			weight: 1
        });
    }

})();
