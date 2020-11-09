(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat', [			
            'app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.decai_fonctionnement_etat',            
            'app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.transfert_reliquat_etat'
            ])        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_feffi_feffi_etat', {
            title : 'Niveau FEFFI',
            icon  : 'icon-flattr',
            weight: 1
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
                var permissions = ["ADMIN","OBCAF","BCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
