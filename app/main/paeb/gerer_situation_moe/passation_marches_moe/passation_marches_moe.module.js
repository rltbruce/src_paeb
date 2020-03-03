(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.passation_marches_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_passation_marches_moe', {
            url      : '/donnees-de-base/passation_marches_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/passation_marches_moe/passation_marches_moe.html',
                    controller : 'Passation_marches_moeController as vm'
                }
            },
            bodyClass: 'passation_marches_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "passation_marches_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.passation_marches_moe', {
            title: 'passation de marchés',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_passation_marches_moe',
			weight: 3
        });
    }

})();
