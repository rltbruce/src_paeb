(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.paiement_pr.paiement_mobilier_pr', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_paiement_pr_paiement_mobilier_pr', {
            url      : '/donnees-de-base/paiement_mobilier_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/paiement_pr/paiement_mobilier_pr/paiement_mobilier_pr.html',
                    controller : 'Paiement_mobilier_prController as vm'
                }
            },
            bodyClass: 'paiement_mobilier_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "paiement_mobilier_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.paiement_pr.paiement_mobilier_pr', {
            title: 'VD_mobilier pr',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_paiement_pr_paiement_mobilier_pr',
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
