(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf', [         
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf.convention_suivi_f_daaf',         
            //'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf.convention_suivi_f_odaaf'
            ])
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf', {
            title : 'Niveau DAAF',
            icon  : 'icon-link',
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
                var permissions = ["ADMIN","DAAF","ODAAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
