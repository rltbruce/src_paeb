(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_ufp_feffi_etat', [	
            'app.paeb.etat_subvention_financiere.niveau_ufp_feffi_etat.convention_suivi_f_ufp_etat'
            ])
        //.run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_ufp_feffi_etat', {
            title : 'Niveau UFP/FEFFI',
            icon  : 'icon-flattr',
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
                var permissions = ["ADMIN","AAC","DPFI","UFP"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
