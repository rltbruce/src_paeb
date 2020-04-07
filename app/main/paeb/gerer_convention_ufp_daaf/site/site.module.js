(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.site', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_convention_ufp_daaf_site', {
            url      : '/donnees-de-base/site',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_convention_ufp_daaf/site/site.html',
                    controller : 'SiteController as vm'
                }
            },
            bodyClass: 'site',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "site"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_convention_ufp_daaf.site', {
            title: 'Site',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_convention_ufp_daaf_site',
			weight: 1
        });
    }

})();
