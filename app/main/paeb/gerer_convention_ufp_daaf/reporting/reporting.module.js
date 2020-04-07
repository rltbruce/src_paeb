(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.reporting', [			
            'app.paeb.gerer_convention_ufp_daaf.reporting.indicateur'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_convention_ufp_daaf.reporting', {
            title : 'Reporting',
            icon  : 'icon-tile-four',
            weight: 3
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
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
