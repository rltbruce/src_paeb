(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cadre_bordereau.travaux_preparatoire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cadre_bordereau_travaux_preparatoire', {
            url      : '/donnees-de-base/travaux_preparatoire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cadre_bordereau/travaux_preparatoire/travaux_preparatoire.html',
                    controller : 'Travaux_preparatoireController as vm'
                }
            },
            bodyClass: 'travaux_preparatoire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "travaux_preparatoire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cadre_bordereau.travaux_preparatoire', {
            title: 'Travaux préparatoire',
            icon  : 'icon-ticket-account',
            state: 'app.paeb_ddb_cadre_bordereau_travaux_preparatoire'
        });
    }

})();
