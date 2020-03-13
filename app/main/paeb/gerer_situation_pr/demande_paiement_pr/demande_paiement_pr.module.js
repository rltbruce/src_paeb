(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.demande_paiement_pr', [
            'app.paeb.gerer_situation_pr.demande_paiement_pr.demande_debut_travaux_pr',
            /*'app.paeb.gerer_situation_pr.demande_paiement_pr.demande_batiment_pr',
            'app.paeb.gerer_situation_pr.demande_paiement_pr.demande_latrine_pr',
            'app.paeb.gerer_situation_pr.demande_paiement_pr.demande_mobilier_pr',
            'app.paeb.gerer_situation_pr.demande_paiement_pr.demande_fin_travaux_pr',*/
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.demande_paiement_pr', {
            title : 'D_paiement PR',
            icon  : 'icon-data',
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
