(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_presence_reliquat', [])
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_convention_presence_reliquat', {
            url      : '/donnees-de-base/etat_subvention_operation/niveau_cisco_feffi_etat/convention_presence_reliquat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_operation/niveau_cisco_feffi_etat/convention_presence_reliquat/convention_presence_reliquat.html',
                    controller : 'Convention_presence_reliquatController as vm'
                }
            },
            bodyClass: 'convention_presence_reliquat',
            data : {
              authorizer : true,
              permitted : ["ACC","ADMIN"],
              page: "convention_presence_reliquat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_presence_reliquat', {
            title: 'Convention avec reliquat',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_convention_presence_reliquat',
            weight: 4
        });



    }

})();
