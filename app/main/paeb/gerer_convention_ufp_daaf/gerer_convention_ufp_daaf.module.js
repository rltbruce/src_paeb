(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf', [			
            'app.paeb.gerer_convention_ufp_daaf.convention_ufp_daaf',
            'app.paeb.gerer_convention_ufp_daaf.convention_ufp_daaf_valide',
            'app.paeb.gerer_convention_ufp_daaf.site',
            'app.paeb.gerer_convention_ufp_daaf.reporting',
            ])
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_convention_ufp_daaf', {
            title : 'Gérer convention ufp/daaf',
            icon  : 'icon-data',
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
                var permissions = ["DAAF","ODAAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
