(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.type_mobilier', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cout_subvention_type_mobilier', {
            url      : '/donnees-de-base/type_mobilier',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cout_subvention/type_mobilier/type_mobilier.html',
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
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cout_subvention.type_mobilier', {
            title: 'Mobilier',
            icon  : 'icon-coin',
            state: 'app.paeb_ddb_cout_subvention_type_mobilier',
            weight: 3

        });
    }

})();
