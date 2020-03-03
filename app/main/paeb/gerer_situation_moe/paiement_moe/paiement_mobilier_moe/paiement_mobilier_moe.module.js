(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.paiement_moe.paiement_mobilier_moe', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_paiement_moe_paiement_mobilier_moe', {
            url      : '/donnees-de-base/paiement_mobilier_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/paiement_moe/paiement_mobilier_moe/paiement_mobilier_moe.html',
                    controller : 'Paiement_mobilier_moeController as vm'
                }
            },
            bodyClass: 'paiement_mobilier_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "paiement_mobilier_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.paiement_moe.paiement_mobilier_moe', {
            title: 'VD_mobilier MOE',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_paiement_moe_paiement_mobilier_moe',
			weight: 4,
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
                var permissions = ["DPFI"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
