(function ()
{
    'use strict';

    angular
        .module('app.paeb.reporting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_reporting', {
            url      : '/donnees-de-base/reporting',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/reporting/reporting.html',
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
        msNavigationServiceProvider.saveItem('paeb.reporting', {
            title: 'Reporting',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_reporting',
			weight: 5
        });
    }

})();
