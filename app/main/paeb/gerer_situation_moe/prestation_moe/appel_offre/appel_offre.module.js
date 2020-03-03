(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe.appel_offre', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_prestation_moe_appel_offre', {
            url      : '/donnees-de-base/appel_offre',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/prestation_moe/appel_offre/appel_offre.html',
                    controller : 'Appel_offreController as vm'
                }
            },
            bodyClass: 'appel_offre',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "appel_offre"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.prestation_moe.appel_offre', {
            title: 'Appel d\'offre',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_prestation_moe_appel_offre',
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
