(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.demande_paiement_moe.demande_debut_travaux_moe', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_demande_paiement_moe_demande_debut_travaux_moe', {
            url      : '/donnees-de-base/demande_debut_travaux_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/demande_paiement_moe/demande_debut_travaux_moe/demande_debut_travaux_moe.html',
                    controller : 'Demande_debut_travaux_moeController as vm'
                }
            },
            bodyClass: 'demande_debut_travaux_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_debut_travaux_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.demande_paiement_moe.demande_debut_travaux_moe', {
            title: 'D_debut travaux',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_demande_paiement_moe_demande_debut_travaux_moe',
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
