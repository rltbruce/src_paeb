(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_ufp_daaf_etat', [
            'app.paeb.etat_subvention_operation.niveau_ufp_daaf_etat.convention_ufp_daaf_etat'
            ])
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_ufp_daaf_etat', {
            title : 'Niveau UFP/DAAF',
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
                var permissions = ["UFP","DAAF","ODAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
