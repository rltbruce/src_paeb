(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.paiement_moe', [
            'app.paeb.gerer_situation_moe.paiement_moe.paiement_debut_travaux_moe',
            'app.paeb.gerer_situation_moe.paiement_moe.paiement_batiment_moe',
            'app.paeb.gerer_situation_moe.paiement_moe.paiement_latrine_moe',
            'app.paeb.gerer_situation_moe.paiement_moe.paiement_mobilier_moe',
            'app.paeb.gerer_situation_moe.paiement_moe.paiement_fin_travaux_moe',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.paiement_moe', {
            title : 'Paiement MOE',
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
