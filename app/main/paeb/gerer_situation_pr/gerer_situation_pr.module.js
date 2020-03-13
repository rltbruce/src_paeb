(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr', [
            'app.paeb.gerer_situation_pr.passation_marches_pr',
            'app.paeb.gerer_situation_pr.contrat_partenaire_relai',
            'app.paeb.gerer_situation_pr.prestation_pr',
            'app.paeb.gerer_situation_pr.demande_paiement_pr',
            //'app.paeb.gerer_situation_pr.validation_demande_paiement_pr_bcaf',
            'app.paeb.gerer_situation_pr.validation_demande_paiement_pr_dpfi',
            //'app.paeb.gerer_situation_pr.validation_demande_paiement_pr_daaf',
            'app.paeb.gerer_situation_pr.paiement_pr',
            'app.paeb.gerer_situation_pr.document_pr_scan',
            'app.paeb.gerer_situation_pr.dossier_pr'

            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr', {
            title : 'Gérer situation PR',
            icon  : 'icon-data',
            weight: 5
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
