(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_fin_travaux_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_suivi_financier_moe_suivi_financier_fin_travaux_moe', {
            url      : '/donnees-de-base/suivi_financier_fin_travaux_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/suivi_financier_moe/suivi_financier_fin_travaux_moe/suivi_financier_fin_travaux_moe.html',
                    controller : 'Suivi_financier_fin_travaux_moeController as vm'
                }
            },
            bodyClass: 'suivi_financier_fin_travaux_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_financier_fin_travaux_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_fin_travaux_moe', {
            title: 'Suivi mobilier_moe',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_suivi_financier_moe_suivi_financier_fin_travaux_moe',
			weight: 16
        });
    }

})();
