(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_suivi_daaf_ufp_suivi_financiere', {
            url      : '/donnees-de-base/gerer_subvention_financiere/suivi_daaf_ufp/suivi_financiere',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/suivi_daaf_ufp/suivi_financiere/suivi_financiere.html',
                    controller : 'Suivi_financiereController as vm'
                }
            },
            bodyClass: 'suivi_financiere',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi_financiere"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere', {
            title: 'Suivi DAAF/UFP',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_subvention_financiere_suivi_daaf_ufp_suivi_financiere',
			weight: 6
        });
    }

})();
