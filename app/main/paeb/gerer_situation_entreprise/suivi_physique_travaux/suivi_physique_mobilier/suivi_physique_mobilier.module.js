(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_mobilier', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_suivi_physique_travaux_suivi_physique_mobilier', {
            url      : '/donnees-de-base/suivi_physique_mobilier',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/suivi_physique_travaux/suivi_physique_mobilier/suivi_physique_mobilier.html',
                    controller : 'Suivi_physique_mobilierController as vm'
                }
            },
            bodyClass: 'suivi_physique_mobilier',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_physique_mobilier"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_mobilier', {
            title: 'Suivi mobilier',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_suivi_physique_travaux_suivi_physique_mobilier',
			weight: 16
        });
    }

})();
