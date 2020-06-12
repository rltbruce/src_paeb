(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi.convention_cisco_feffi_validation', [])
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_cisco_feffi_convention_cisco_feffi_validation', {
            url      : '/donnees-de-base/convention_cisco_feffi_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_cisco_feffi/convention_cisco_feffi_validation/convention_cisco_feffi_validation.html',
                    controller : 'Convention_cisco_feffi_validationController as vm'
                }
            },
            bodyClass: 'convention_cisco_feffi_validation',
            data : {
              authorizer : true,
              permitted : ["ACC","ADMIN"],
              page: "Convention_cisco_feffi_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_cisco_feffi.convention_cisco_feffi_validation', {
            title: 'Validation convention',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_subvention_operation_niveau_cisco_feffi_convention_cisco_feffi_validation',
			weight: 3,
            hidden: function()
            {
                    return vs;
            }
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
