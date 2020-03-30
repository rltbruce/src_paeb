(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.convention_ufp_daaf', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_convention_ufp_daaf_convention_ufp_daaf', {
            url      : '/donnees-de-base/convention_ufp_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_convention_ufp_daaf/convention_ufp_daaf/convention_ufp_daaf.html',
                    controller : 'Convention_ufp_daafController as vm'
                }
            },
            bodyClass: 'convention_ufp_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Convention_ufp_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_convention_ufp_daaf.convention_ufp_daaf', {
            title: 'Saisie convention',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_convention_ufp_daaf_convention_ufp_daaf',
			weight: 1
        });
    }

})();
