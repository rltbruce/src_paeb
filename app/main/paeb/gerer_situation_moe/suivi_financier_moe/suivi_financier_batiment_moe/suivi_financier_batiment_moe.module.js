(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_batiment_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_suivi_financier_moe_suivi_financier_batiment_moe', {
            url      : '/donnees-de-base/suivi_financier_batiment_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/suivi_financier_moe/suivi_financier_batiment_moe/suivi_financier_batiment_moe.html',
                    controller : 'Suivi_financier_batiment_moeController as vm'
                }
            },
            bodyClass: 'suivi_financier_batiment_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_financier_batiment_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_batiment_moe', {
            title: 'Suivi batiment_moe',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_suivi_financier_moe_suivi_financier_batiment_moe',
			weight: 16
        });
    }

})();
