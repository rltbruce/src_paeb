(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.type_batiment', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cout_subvention_type_batiment', {
            url      : '/donnees-de-base/type_batiment',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cout_subvention/type_batiment/type_batiment.html',
                    controller : 'Type_batimentController as vm'
                }
            },
            bodyClass: 'type_batiment',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "type_batiment"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cout_subvention.type_batiment', {
            title: 'Batiment',
            icon  : 'icon-coin',
            state: 'app.paeb_ddb_cout_subvention_type_batiment',
            weight: 1
        });
    }

})();
