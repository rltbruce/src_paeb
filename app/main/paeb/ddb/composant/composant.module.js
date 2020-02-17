(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.composant', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_composant', {
            url      : '/donnees-de-base/composant',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/composant/composant.html',
                    controller : 'ComposantController as vm'
                }
            },
            bodyClass: 'composant',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "composant"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.composant', {
            title: 'Composant',
            icon  : 'icon-ticket-account',
            state: 'app.paeb_ddb_composant'
        });
    }

})();
