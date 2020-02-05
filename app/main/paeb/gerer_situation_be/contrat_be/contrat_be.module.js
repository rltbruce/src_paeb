(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_be.contrat_be', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_be_contrat_be', {
            url      : '/donnees-de-base/contrat_be',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_be/contrat_be/contrat_be.html',
                    controller : 'Contrat_beController as vm'
                }
            },
            bodyClass: 'contrat_be',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "contrat_be"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_be.contrat_be', {
            title: 'Contrat be',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_be_contrat_be',
			weight: 3
        });
    }

})();
