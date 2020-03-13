(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_latrine', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_suivi_physique_travaux_suivi_physique_latrine', {
            url      : '/donnees-de-base/suivi_physique_latrine',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/suivi_physique_travaux/suivi_physique_latrine/suivi_physique_latrine.html',
                    controller : 'Suivi_physique_latrineController as vm'
                }
            },
            bodyClass: 'suivi_physique_latrine',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_physique_latrine"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_latrine', {
            title: 'Suivi latrine',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_suivi_physique_travaux_suivi_physique_latrine',
			weight: 16
        });
    }

})();
