(function ()
{
    'use strict';

    angular
        .module('app.paeb.suivi_daaf', [           
            'app.paeb.suivi_daaf.convention_suivi_daaf',
            //'app.paeb.suivi_daaf.convention_suivi_odaaf',
            ])
        .run(testPermission)       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.suivi_daaf', {
            title : 'DAAF',
            icon  : 'icon-data',
            weight: 5,
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
