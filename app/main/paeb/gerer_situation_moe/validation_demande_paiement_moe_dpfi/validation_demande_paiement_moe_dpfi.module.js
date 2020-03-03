(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi', [
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi.validation_demande_debut_travaux_moe_dpfi',
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi.validation_demande_batiment_moe_dpfi',
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi.validation_demande_latrine_moe_dpfi',
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi.validation_demande_mobilier_moe_dpfi',
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi.validation_demande_fin_travaux_moe_dpfi',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi', {
            title : 'VD_paiement (DPFI)',
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
