(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi', [			
            'app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.decai_fonctionnement',         
            'app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.decai_fonctionnement_validation',         
            'app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.transfert_reliquat_obcaf',         
            'app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.transfert_reliquat_bcaf',         
            'app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.addition_frais_fonctionnement',         
            'app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.addition_frais_fonctionnement_validation'
            ]) 
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_feffi', {
            title : 'Niveau FEFFI',
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
                var permissions = ["ADMIN","DPFI","AAC"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
