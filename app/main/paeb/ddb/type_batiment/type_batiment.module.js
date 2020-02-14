(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.type_batiment', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_type_batiment', {
            url      : '/donnees-de-base/type_batiment',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/type_batiment/type_batiment.html',
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
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.type_batiment', {
            title: 'Type batiment',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_type_batiment',
			weight: 6
        });
    }

})();
