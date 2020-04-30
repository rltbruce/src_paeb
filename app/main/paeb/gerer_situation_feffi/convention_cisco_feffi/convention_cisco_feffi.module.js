(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_convention_cisco_feffi', {
            url      : '/donnees-de-base/convention_cisco_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/convention_cisco_feffi/convention_cisco_feffi.html',
                    controller : 'Convention_cisco_feffiController as vm'
                }
            },
            bodyClass: 'convention_cisco_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Convention_cisco_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.convention_cisco_feffi', {
            title: 'Convention C/F',
            icon  : 'icon-source-fork',
            state: 'app.paeb_gerer_situation_feffi_convention_cisco_feffi',
			weight: 1
        });
    }

})();
