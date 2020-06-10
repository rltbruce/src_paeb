(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_ufp_daaf.compte_daaf', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_ufp_daaf_compte_daaf', {
            url      : '/donnees-de-base/compte_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_ufp_daaf/compte_daaf/compte_daaf.html',
                    controller : 'Compte_daafController as vm'
                }
            },
            bodyClass: 'compte_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "compte_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_ufp_daaf.compte_daaf', {
            title: 'Compte paeb',
            icon  : 'icon-bank',
            state: 'app.paeb_gerer_subvention_operation_niveau_ufp_daaf_compte_daaf',
			weight: 5
        });
    }

})();
