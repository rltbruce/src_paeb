(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi', [
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi.site',
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi.site_validation',
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi.convention_cisco_feffi',
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi.convention_cisco_feffi_validation',
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi.feffi',
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi.insertion_avenant_document',
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi.validation_avenant_document'
            ])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_cisco_feffi', {
            title : 'Niveau CISCO/FEFFI',
            icon  : 'icon-black-mesa',
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
                var permissions = ["DPFI","AAC","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
