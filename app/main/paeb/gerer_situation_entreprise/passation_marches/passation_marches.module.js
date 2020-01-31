(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.passation_marches', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_passation_marches', {
            url      : '/donnees-de-base/passation_marches',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/passation_marches/passation_marches.html',
                    controller : 'Passation_marchesController as vm'
                }
            },
            bodyClass: 'passation_marches',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "passation_marches"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.passation_marches', {
            title: 'passation de marchés',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_passation_marches',
			weight: 3
        });
    }

})();
