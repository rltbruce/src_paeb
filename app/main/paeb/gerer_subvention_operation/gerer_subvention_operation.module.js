(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation', [
            'app.paeb.gerer_subvention_operation.niveau_ufp_daaf',
            'app.paeb.gerer_subvention_operation.niveau_cisco_feffi',
            'app.paeb.gerer_subvention_operation.niveau_feffi_prestataire'
            ])
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation', {
            title : 'Gestion technique des activités',
            icon  : 'icon-data',
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
                var permissions = ["DAAF","ODAAF","ADMIN","BCAF","AAC","DPFI","ODPFI"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
