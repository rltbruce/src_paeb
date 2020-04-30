(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.type_cout_maitrise', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cout_subvention_type_cout_maitrise', {
            url      : '/donnees-de-base/type_cout_maitrise',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cout_subvention/type_cout_maitrise/type_cout_maitrise.html',
                    controller : 'Type_cout_maitriseController as vm'
                }
            },
            bodyClass: 'type_cout_maitrise',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "type_cout_maitrise"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cout_subvention.type_cout_maitrise', {
            title: 'Maitrise d\'oeuvre',
            icon  : 'icon-coin',
            state: 'app.paeb_ddb_cout_subvention_type_cout_maitrise',
            weight: 4
        });
    }

})();
