(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi', [			
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_bcaf',          
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_dpfi',          
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf'
            ])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_daaf_feffi', {
            title : 'Niveau DAAF-DPFI/FEFFI',
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
                var permissions = ["ADMIN","DPFI","DAAF","BCAF","OBCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
