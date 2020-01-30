(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.convention_daff_ufp', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_convention_ufp_daaf_convention_daff_ufp', {
            url      : '/donnees-de-base/convention_daff_ufp',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_convention_ufp_daaf/convention_daff_ufp/convention_daff_ufp.html',
                    controller : 'Convention_daff_ufpController as vm'
                }
            },
            bodyClass: 'convention_daff_ufp',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Convention_daff_ufp"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_convention_ufp_daaf.convention_daff_ufp', {
            title: 'Convention DAAF/UFP',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_convention_ufp_daaf_convention_daff_ufp',
			weight: 2
        });
    }

})();
