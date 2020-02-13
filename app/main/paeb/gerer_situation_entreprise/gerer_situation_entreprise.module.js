(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise', [
            'app.paeb.gerer_situation_entreprise.passation_marches',
            'app.paeb.gerer_situation_entreprise.contrat_prestataire',
            'app.paeb.gerer_situation_entreprise.demande_payement_prestataire',
            'app.paeb.gerer_situation_entreprise.validation_demande_payement_prestataire',
            'app.paeb.gerer_situation_entreprise.validation_fina_demande_payement_prestataire',
            'app.paeb.gerer_situation_entreprise.suivi_execution_travaux',
            'app.paeb.gerer_situation_entreprise.prestation_mpe',
            'app.paeb.gerer_situation_entreprise.demande_payement_prestataire_valide',
            'app.paeb.gerer_situation_entreprise.payement_prestataire'

            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise', {
            title : 'Gerer situation entreprise',
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
