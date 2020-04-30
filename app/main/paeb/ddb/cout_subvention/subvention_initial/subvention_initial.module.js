(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.subvention_initial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cout_subvention_subvention_initial', {
            url      : '/donnees-de-base/subvention_initial',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cout_subvention/subvention_initial/subvention_initial.html',
                    controller : 'Subvention_initialController as vm'
                }
            },
            bodyClass: 'subvention_initial',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "subvention_initial"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cout_subvention.subvention_initial', {
            title: 'Subvention initial',
            icon  : 'icon-coin',
            state: 'app.paeb_ddb_cout_subvention_subvention_initial',
            weight: 6

        });
    }

})();
