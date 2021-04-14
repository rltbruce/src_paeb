(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports.reporting_map', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_reports_reporting_map', {
            url      : '/donnees-de-base/reporting_map',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/reports/reporting_map/reporting_map.html',
                    controller : 'Reporting_mapController as vm'
                }
            },
            bodyClass: 'reporting_map',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "reporting_map"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.reports.reporting_map', {
            title: 'Reporting vue carte',
            icon  : 'icon-google-maps',
            state: 'app.paeb_reports_reporting_map',
			weight: 1
        });
    }

})();
