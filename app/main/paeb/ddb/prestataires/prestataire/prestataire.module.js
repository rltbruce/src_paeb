(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.prestataires.prestataire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_prestataires_prestataire', {
            url      : '/donnees-de-base/prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/prestataires/prestataire/prestataire.html',
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
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.prestataires.prestataire', {
            title: 'Entreprise',
            icon  : 'icon-engine-outline',

            state: 'app.paeb_ddb_prestataires_prestataire'

        });
    }

})();
