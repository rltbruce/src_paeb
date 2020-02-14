(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.type_mobilier', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_type_mobilier', {
            url      : '/donnees-de-base/type_mobilier',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/type_mobilier/type_mobilier.html',
                    controller : 'Type_mobilierController as vm'
                }
            },
            bodyClass: 'type_mobilier',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "type_mobilier"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.type_mobilier', {
            title: 'Type mobilier',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_type_mobilier',
			weight: 6
        });
    }

})();
