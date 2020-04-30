(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.type_cout_sousprojet', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cout_subvention_type_cout_sousprojet', {
            url      : '/donnees-de-base/type_cout_sousprojet',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cout_subvention/type_cout_sousprojet/type_cout_sousprojet.html',
                    controller : 'Type_cout_sousprojetController as vm'
                }
            },
            bodyClass: 'type_cout_sousprojet',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "type_cout_sousprojet"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cout_subvention.type_cout_sousprojet', {
            title: 'Sous projet',
            icon  : 'icon-coin',
            state: 'app.paeb_ddb_cout_subvention_type_cout_sousprojet',
            weight: 5
        });
    }

})();
