(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.demande_payement_prestataire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_demande_payement_prestataire', {
            url      : '/donnees-de-base/demande_payement_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/demande_payement_prestataire/demande_payement_prestataire.html',
                    controller : 'Demande_payement_prestataireController as vm'
                }
            },
            bodyClass: 'demande_payement_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_payement_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.demande_payement_prestataire', {
            title: 'demande payement',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_demande_payement_prestataire',
			weight: 3
        });
    }

})();
