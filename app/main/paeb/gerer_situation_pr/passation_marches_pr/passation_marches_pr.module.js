(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.passation_marches_pr', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_passation_marches_pr', {
            url      : '/donnees-de-base/passation_marches_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/passation_marches_pr/passation_marches_pr.html',
                    controller : 'Passation_marches_prController as vm'
                }
            },
            bodyClass: 'passation_marches_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "passation_marches_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.passation_marches_pr', {
            title: 'passation de marchés',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_passation_marches_pr',
			weight: 2
        });
    }

})();
