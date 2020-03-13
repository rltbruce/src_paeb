(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_batiment', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_suivi_physique_travaux_suivi_physique_batiment', {
            url      : '/donnees-de-base/suivi_physique_batiment',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/suivi_physique_travaux/suivi_physique_batiment/suivi_physique_batiment.html',
                    controller : 'Suivi_physique_batimentController as vm'
                }
            },
            bodyClass: 'suivi_physique_batiment',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_physique_batiment"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_batiment', {
            title: 'Suivi batiment',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_suivi_physique_travaux_suivi_physique_batiment',
			weight: 16
        });
    }

})();
