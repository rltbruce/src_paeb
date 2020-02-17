(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.infrastructure', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_infrastructure', {
            url      : '/donnees-de-base/infrastructure',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/infrastructure/infrastructure.html',
                    controller : 'InfrastructureController as vm'
                }
            },
            bodyClass: 'infrastructure',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "infrastructure"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.infrastructure', {
            title: 'Infrastructure',
            icon  : 'icon-clipboard-text',
<<<<<<< HEAD
            state: 'app.paeb_ddb_infrastructure'
=======
            state: 'app.paeb_ddb_infrastructure',
			weight: 11
>>>>>>> origin/master
        });
    }

})();
