(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_need_avenant', [])
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_convention_need_avenant', {
            url      : '/donnees-de-base/etat_subvention_operation/niveau_cisco_feffi_etat/convention_need_avenant',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_operation/niveau_cisco_feffi_etat/convention_need_avenant/convention_need_avenant.html',
                    controller : 'Convention_need_avenantController as vm'
                }
            },
            bodyClass: 'convention_need_avenant',
            data : {
              authorizer : true,
              permitted : ["ACC","ADMIN"],
              page: "convention_need_avenant"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_need_avenant', {
            title: 'Convention besoin avenant',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_convention_need_avenant',
            weight: 4
        });



    }

})();
