(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.type_latrine', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cout_subvention_type_latrine', {
            url      : '/donnees-de-base/type_latrine',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cout_subvention/type_latrine/type_latrine.html',
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
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cout_subvention.type_latrine', {
            title: 'Latrine',
            icon  : 'icon-coin',
            state: 'app.paeb_ddb_cout_subvention_type_latrine',
            weight: 2
        });
    }

})();
