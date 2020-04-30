(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_latrine_mpe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_suivi_financier_mpe_suivi_financier_latrine_mpe', {
            url      : '/donnees-de-base/suivi_financier_latrine_mpe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/suivi_financier_mpe/suivi_financier_latrine_mpe/suivi_financier_latrine_mpe.html',
                    controller : 'Suivi_financier_latrine_mpeController as vm'
                }
            },
            bodyClass: 'suivi_financier_latrine_mpe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_financier_latrine_mpe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_latrine_mpe', {
            title: 'Suivi latrine_mpe',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_suivi_financier_mpe_suivi_financier_latrine_mpe',
			weight: 16
        });
    }

})();
