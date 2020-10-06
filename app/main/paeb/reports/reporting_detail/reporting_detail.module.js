(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports.reporting_detail', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_reports_reporting_detail', {
            url      : '/donnees-de-base/reporting_detail',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/reports/reporting_detail/reporting_detail.html',
                    controller : 'Reporting_detailController as vm'
                }
            },
            bodyClass: 'reporting_detail',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "reporting_detail"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.reports.reporting_detail', {
            title: 'Reporting',
            icon  : 'icon-calendar-text',
            state: 'app.paeb_reports_reporting_detail',
			weight: 1
        });
    }

})();
