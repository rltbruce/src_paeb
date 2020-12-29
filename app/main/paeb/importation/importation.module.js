(function ()
{
    'use strict';

    angular
        .module('app.paeb.importation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_importation', {
            url      : '/donnees-de-base/importation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/importation/importation.html',
                    controller : 'ImportationController as vm'
                }
            },
            bodyClass: 'importation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "importation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.importation', {
            title: 'Importation',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_importation',
			weight: 8
        });
    }

})();
