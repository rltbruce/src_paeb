(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire', [
            'app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_bcaf',
            'app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_dpfi'
            ])
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_feffi_prestataire', {
            title : 'Niveau FEFFI/PRESTATAIRE',
            icon  : 'icon-black-mesa',
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
                var permissions = ["BCAF","DPFI","ODPFI","ACC","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
