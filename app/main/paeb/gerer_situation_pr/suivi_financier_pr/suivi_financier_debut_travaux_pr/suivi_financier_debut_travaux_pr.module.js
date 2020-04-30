(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.suivi_financier_pr.suivi_financier_debut_travaux_pr', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_suivi_financier_pr_suivi_financier_debut_travaux_pr', {
            url      : '/donnees-de-base/suivi_financier_debut_travaux_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/suivi_financier_pr/suivi_financier_debut_travaux_pr/suivi_financier_debut_travaux_pr.html',
                    controller : 'Suivi_financier_debut_travaux_prController as vm'
                }
            },
            bodyClass: 'suivi_financier_debut_travaux_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi_financier_debut_travaux_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.suivi_financier_pr.suivi_financier_debut_travaux_pr', {
            title: 'Preparation travaux',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_suivi_financier_pr_suivi_financier_debut_travaux_pr',
			weight: 16
        });
    }

})();
