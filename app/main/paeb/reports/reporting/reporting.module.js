(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports.reporting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_reports_reporting', {
            url      : '/donnees-de-base/reporting',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/reports/reporting/reporting.html',
                    controller : 'ReportingController as vm'
                }
            },
            bodyClass: 'reporting',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "reporting"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.reports.reporting', {
            title: 'Reporting',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_reports_reporting',
			weight: 1
        });
    }

})();
