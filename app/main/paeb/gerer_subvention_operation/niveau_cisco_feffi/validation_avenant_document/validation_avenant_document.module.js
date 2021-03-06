(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi.validation_avenant_document', [])
        .run(testPermission)
        .config(config);
    var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_cisco_feffi_validation_avenant_document', {
            url      : '/donnees-de-base/gerer_subvention_operation/niveau_cisco_feffi/validation_avenant_document',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_cisco_feffi/validation_avenant_document/validation_avenant_document.html',
                    controller : 'Validation_avenant_documentController as vm'
                }
            },
            bodyClass: 'validation_avenant_document',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "validation_avenant_document"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_cisco_feffi.validation_avenant_document', {
            title: 'Validation avenant et document',
            icon  : 'icon-keyboard-variant',
            state: 'app.paeb_gerer_subvention_operation_niveau_cisco_feffi_validation_avenant_document',
            weight: 7,
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
                var permissions = ["DPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
