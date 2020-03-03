(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe.rapport_mensuel', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_prestation_moe_rapport_mensuel', {
            url      : '/donnees-de-base/rapport_mensuel',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/prestation_moe/rapport_mensuel/rapport_mensuel.html',
                    controller : 'Rapport_mensuelController as vm'
                }
            },
            bodyClass: 'rapport_mensuel',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "rapport_mensuel"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.prestation_moe.rapport_mensuel', {
            title: 'Rapport mensuel',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_prestation_moe_rapport_mensuel',
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
