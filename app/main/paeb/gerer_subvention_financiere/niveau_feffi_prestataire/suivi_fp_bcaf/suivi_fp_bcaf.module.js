(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf', [            
            'app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf.convention_suivi_fp_obcaf',         
            'app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf.convention_suivi_fp_bcaf'
            ])
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf', {
            title : 'BCAF',
            icon  : 'icon-link',
            weight: 4,
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
                var permissions = ["OBCAF","BCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
