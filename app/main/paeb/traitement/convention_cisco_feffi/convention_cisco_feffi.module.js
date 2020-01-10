(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.convention_cisco_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_traitement_convention_cisco_feffi', {
            url      : '/donnees-de-base/convention_cisco_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/traitement/convention_cisco_feffi/convention_cisco_feffi.html',
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
        msNavigationServiceProvider.saveItem('paeb.traitement.convention_cisco_feffi', {
            title: 'Convention cisco/feffi',
            icon  : 'icon-tile-four',
            state: 'app.paeb_traitement_convention_cisco_feffi',
			weight: 1
        });
    }

})();
