(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe.manuel_gestion', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_prestation_moe_manuel_gestion', {
            url      : '/donnees-de-base/manuel_gestion',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/prestation_moe/manuel_gestion/manuel_gestion.html',
                    controller : 'Manuel_gestionController as vm'
                }
            },
            bodyClass: 'manuel_gestion',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "manuel_gestion"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.prestation_moe.manuel_gestion', {
            title: 'Manuel gestion',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_prestation_moe_manuel_gestion',
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
                var permissions = ["OBCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
