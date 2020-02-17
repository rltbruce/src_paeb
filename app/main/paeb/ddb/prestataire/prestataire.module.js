(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.prestataire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_prestataire', {
            url      : '/donnees-de-base/prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/prestataire/prestataire.html',
                    controller : 'PrestataireController as vm'
                }
            },
            bodyClass: 'prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.prestataire', {
            title: 'Prestataire',
            icon  : 'icon-ticket-account',
            state: 'app.paeb_ddb_prestataire'
        });
    }

})();
