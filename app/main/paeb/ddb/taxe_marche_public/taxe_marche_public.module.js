(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.taxe_marche_public', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_taxe_marche_public', {
            url      : '/donnees-de-base/taxe_marche_public',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/taxe_marche_public/taxe_marche_public.html',
                    controller : 'Taxe_marche_publicController as vm'
                }
            },
            bodyClass: 'taxe_marche_public',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Taxe_marche_public"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.taxe_marche_public', {
            title: 'Taxe sur marchés publics',
            icon  : 'icon-fullscreen-exit',
            state: 'app.paeb_ddb_taxe_marche_public',
            weight: 16
        });
    }

})();
