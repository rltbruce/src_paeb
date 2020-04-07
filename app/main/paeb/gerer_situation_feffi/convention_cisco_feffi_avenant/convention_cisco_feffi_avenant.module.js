(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi_avenant', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_convention_cisco_feffi_avenant', {
            url      : '/donnees-de-base/convention_cisco_feffi_avenant',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/convention_cisco_feffi_avenant/convention_cisco_feffi_avenant.html',
                    controller : 'Convention_cisco_feffi_avenantController as vm'
                }
            },
            bodyClass: 'convention_cisco_feffi_avenant',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Convention_cisco_feffi_avenant"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.convention_cisco_feffi_avenant', {
            title: 'Avenant C/F ',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_situation_feffi_convention_cisco_feffi_avenant',
			weight: 2
        });
    }

})();
