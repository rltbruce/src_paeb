(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_batiment_mpe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_suivi_financier_mpe_suivi_financier_batiment_mpe', {
            url      : '/donnees-de-base/suivi_financier_batiment_mpe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/suivi_financier_mpe/suivi_financier_batiment_mpe/suivi_financier_batiment_mpe.html',
                    controller : 'Suivi_financier_batiment_mpeController as vm'
                }
            },
            bodyClass: 'suivi_financier_batiment_mpe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_financier_batiment_mpe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_batiment_mpe', {
            title: 'Suivi batiment_mpe',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_suivi_financier_mpe_suivi_financier_batiment_mpe',
			weight: 16
        });
    }

})();
