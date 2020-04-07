(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.demande_paiement_moe.demande_batiment_moe', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_demande_paiement_moe_demande_batiment_moe', {
            url      : '/donnees-de-base/demande_batiment_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/demande_paiement_moe/demande_batiment_moe/demande_batiment_moe.html',
                    controller : 'Demande_batiment_moeController as vm'
                }
            },
            bodyClass: 'demande_batiment_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_batiment_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.demande_paiement_moe.demande_batiment_moe', {
            title: 'Batiment MOE',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_demande_paiement_moe_demande_batiment_moe',
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
