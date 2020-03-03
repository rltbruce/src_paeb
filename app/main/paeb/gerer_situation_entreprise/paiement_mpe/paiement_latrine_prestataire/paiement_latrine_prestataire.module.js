(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.paiement_mpe.paiement_latrine_prestataire', [])
        .run(testPermission)
        .config(config);

        var vs;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_paiement_mpe_paiement_latrine_prestataire', {
            url      : '/donnees-de-base/paiement_latrine_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/paiement_mpe/paiement_latrine_prestataire/paiement_latrine_prestataire.html',
                    controller : 'Paiement_latrine_prestataireController as vm'
                }
            },
            bodyClass: 'paiement_latrine_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "paiement_latrine_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.paiement_mpe.paiement_latrine_prestataire', {
            title: 'P_latrine MPE',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_paiement_mpe_paiement_latrine_prestataire',
			weight: 2,
            hidden:function()
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
