(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.zone_subvention', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_zone_subvention', {
            url      : '/donnees-de-base/zone_subvention',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/zone_subvention/zone_subvention.html',
                    controller : 'Zone_subventionController as vm'
                }
            },
            bodyClass: 'zone_subvention',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Zone_subvention"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.zone_subvention', {
            title: 'Zone subvention',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_zone_subvention',
			weight: 5
        });
    }

})();
