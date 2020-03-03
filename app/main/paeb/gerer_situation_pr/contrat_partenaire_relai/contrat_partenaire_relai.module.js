(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.contrat_partenaire_relai', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_contrat_partenaire_relai', {
            url      : '/donnees-de-base/contrat_partenaire_relai',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/contrat_partenaire_relai/contrat_partenaire_relai.html',
                    controller : 'Contrat_partenaire_relaiController as vm'
                }
            },
            bodyClass: 'contrat_partenaire_relai',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "contrat_partenaire_relai"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.contrat_partenaire_relai', {
            title: 'Contrat PR',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_contrat_partenaire_relai',
			weight: 3
        });
    }

})();
