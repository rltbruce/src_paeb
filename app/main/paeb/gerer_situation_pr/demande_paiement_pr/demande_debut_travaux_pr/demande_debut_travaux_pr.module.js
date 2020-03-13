(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.demande_paiement_pr.demande_debut_travaux_pr', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_demande_paiement_pr_demande_debut_travaux_pr', {
            url      : '/donnees-de-base/demande_debut_travaux_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/demande_paiement_pr/demande_debut_travaux_pr/demande_debut_travaux_pr.html',
                    controller : 'Demande_debut_travaux_prController as vm'
                }
            },
            bodyClass: 'demande_debut_travaux_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_debut_travaux_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.demande_paiement_pr.demande_debut_travaux_pr', {
            title: 'Demande',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_demande_paiement_pr_demande_debut_travaux_pr',
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
