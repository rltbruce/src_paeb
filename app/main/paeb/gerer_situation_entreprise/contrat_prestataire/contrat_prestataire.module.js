(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.contrat_prestataire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_contrat_prestataire', {
            url      : '/donnees-de-base/contrat_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/contrat_prestataire/contrat_prestataire.html',
                    controller : 'Contrat_prestataireController as vm'
                }
            },
            bodyClass: 'contrat_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "contrat_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.contrat_prestataire', {
            title: 'Contrat prestataire',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_contrat_prestataire',
			weight: 3
        });
    }

})();
