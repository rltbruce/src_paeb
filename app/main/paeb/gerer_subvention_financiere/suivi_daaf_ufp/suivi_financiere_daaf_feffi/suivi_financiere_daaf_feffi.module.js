(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere_daaf_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_suivi_daaf_ufp_suivi_financiere_daaf_feffi', {
            url      : '/donnees-de-base/gerer_subvention_financiere/suivi_daaf_ufp/suivi_financiere_daaf_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/suivi_daaf_ufp/suivi_financiere_daaf_feffi/suivi_financiere_daaf_feffi.html',
                    controller : 'Suivi_financiere_daaf_feffiController as vm'
                }
            },
            bodyClass: 'suivi_financiere_daaf_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi_financiere_daaf_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere_daaf_feffi', {
            title: 'Suivi DAAF/FEFFI',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_subvention_financiere_suivi_daaf_ufp_suivi_financiere_daaf_feffi',
			weight: 6
        });
    }

})();
