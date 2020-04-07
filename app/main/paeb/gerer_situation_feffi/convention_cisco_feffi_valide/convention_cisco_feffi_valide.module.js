(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi_valide', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_convention_cisco_feffi_valide', {
            url      : '/donnees-de-base/convention_cisco_feffi_valide',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/convention_cisco_feffi_valide/convention_cisco_feffi_valide.html',
                    controller : 'Convention_cisco_feffi_valideController as vm'
                }
            },
            bodyClass: 'convention_cisco_feffi_valide',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Convention_cisco_feffi_valide"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.convention_cisco_feffi_valide', {
            title: 'Convention C/F validée',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_situation_feffi_convention_cisco_feffi_valide',
			weight: 2
        });
    }

})();
