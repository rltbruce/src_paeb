(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_be.passation_marches_be', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_be_passation_marches_be', {
            url      : '/donnees-de-base/passation_marches_be',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_be/passation_marches_be/passation_marches_be.html',
                    controller : 'Passation_marches_beController as vm'
                }
            },
            bodyClass: 'passation_marches_be',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "passation_marches_be"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_be.passation_marches_be', {
            title: 'passation de marchés',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_be_passation_marches_be',
			weight: 3
        });
    }

})();
