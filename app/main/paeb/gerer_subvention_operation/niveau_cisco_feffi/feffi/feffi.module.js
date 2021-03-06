(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi.feffi', [])
        .run(testPermission)
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_cisco_feffi_feffi', {
            url      : '/donnees-de-base/gerer_subvention_operation/niveau_cisco_feffi/feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_cisco_feffi/feffi/feffi.html',
                    controller : 'FeffiController as vm'
                }
            },
            bodyClass: 'feffi',
            data : {
              authorizer : true,
              permitted : ["AAC","ADMIN"],
              page: "FEFFI"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_cisco_feffi.feffi', {
            title: 'Renseignement FEFFI',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_subvention_operation_niveau_cisco_feffi_feffi',
            weight: 1,
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
                var permissions = ["AAC","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
