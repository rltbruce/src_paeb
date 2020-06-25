(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.type_cout_divers', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_type_cout_divers', {
            url      : '/donnees-de-base/type_cout_divers',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/type_cout_divers/type_cout_divers.html',
                    controller : 'type_cout_diversController as vm'
                }
            },
            bodyClass: 'type_cout_divers',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "type_cout_divers"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.type_cout_divers', {
            title: 'Type coût divers',
            icon  : 'icon-tile-four',
            state: 'app.paeb_ddb_type_cout_divers',
            weight: 11
        });
    }

})();
