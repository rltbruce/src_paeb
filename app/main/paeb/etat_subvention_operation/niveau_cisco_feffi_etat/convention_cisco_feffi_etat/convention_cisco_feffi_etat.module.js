(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_cisco_feffi_etat', [])
        .config(config);
    var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_convention_cisco_feffi_etat', {
            url      : '/donnees-de-base/convention_cisco_feffi_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_operation/niveau_cisco_feffi_etat/convention_cisco_feffi_etat/convention_cisco_feffi_etat.html',
                    controller : 'Convention_cisco_feffi_etatController as vm'
                }
            },
            bodyClass: 'convention_cisco_feffi_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_cisco_feffi_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_cisco_feffi_etat', {
            title: 'Information sur convention CISCO/FEFFI',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_convention_cisco_feffi_etat',
			weight: 3
        });

    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["BCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
