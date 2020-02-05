(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_execution_travaux', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_suivi_execution_travaux', {
            url      : '/donnees-de-base/suivi_execution_travaux',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/suivi_execution_travaux/suivi_execution_travaux.html',
                    controller : 'Suivi_execution_travauxController as vm'
                }
            },
            bodyClass: 'suivi_execution_travaux',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_execution_travaux"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.suivi_execution_travaux', {
            title: 'Suivi execution',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_suivi_execution_travaux',
			weight: 3
        });
    }

})();
