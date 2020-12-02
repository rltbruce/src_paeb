(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire', [
            'app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.convention_suivi_fp_bcaf',
            'app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.convention_suivi_fp_obcaf'
            ]) 
        .run(testPermission)      
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)//Suivi DAAF/UFP
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_prestataire', {
            title : 'Niveau FEFFI/PRESTATAIRE',
            icon  : 'icon-flattr',
            weight: 6,
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
                var permissions = ["AAC","DPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }


})();
