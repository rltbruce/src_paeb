(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.contrat_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_contrat_moe', {
            url      : '/donnees-de-base/contrat_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/contrat_moe/contrat_moe.html',
                    controller : 'Contrat_moeController as vm'
                }
            },
            bodyClass: 'contrat_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "contrat_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.contrat_moe', {
            title: 'Contrat be',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_contrat_moe',
			weight: 3
        });
    }

})();
