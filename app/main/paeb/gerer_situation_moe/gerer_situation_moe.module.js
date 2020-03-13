(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe', [
            'app.paeb.gerer_situation_moe.passation_marches_moe',
            'app.paeb.gerer_situation_moe.contrat_moe',
            'app.paeb.gerer_situation_moe.prestation_moe',
            'app.paeb.gerer_situation_moe.demande_paiement_moe',
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_bcaf',
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_dpfi',
            'app.paeb.gerer_situation_moe.validation_demande_paiement_moe_daaf',
            'app.paeb.gerer_situation_moe.paiement_moe',
            'app.paeb.gerer_situation_moe.document_moe_scan',
            'app.paeb.gerer_situation_moe.dossier_moe'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe', {
            title : 'Gérer situation BE',
            icon  : 'icon-data',
            weight: 4
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
