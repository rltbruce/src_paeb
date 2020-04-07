(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.reporting.indicateur', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_convention_ufp_daaf_reporting_indicateur', {
            url      : '/donnees-de-base/indicateur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_convention_ufp_daaf/reporting/indicateur/indicateur.html',
                    controller : 'IndicateurController as vm'
                }
            },
            bodyClass: 'indicateur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "indicateur"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_convention_ufp_daaf.reporting.indicateur', {
            title: 'indicateur',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_convention_ufp_daaf_reporting_indicateur',
			weight: 1
        });
    }

})();
