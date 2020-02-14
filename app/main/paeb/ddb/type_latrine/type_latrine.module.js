(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.type_latrine', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_type_latrine', {
            url      : '/donnees-de-base/type_latrine',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/type_latrine/type_latrine.html',
                    controller : 'Type_latrineController as vm'
                }
            },
            bodyClass: 'type_latrine',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "type_latrine"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.type_latrine', {
            title: 'Type latrine',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_type_latrine',
			weight: 7
        });
    }

})();
