(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_bcaf', [			
            'app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_bcaf.convention_suivi_bcaf',
            'app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_bcaf.convention_suivi_obcaf'
            ])
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_bcaf', {
            title : 'BCAF',
            icon  : 'icon-blur-radial',
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
                var permissions = ["DAAF","ODAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
