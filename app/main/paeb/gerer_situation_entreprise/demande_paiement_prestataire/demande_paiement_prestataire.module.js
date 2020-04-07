(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.demande_paiement_prestataire', [
            'app.paeb.gerer_situation_entreprise.demande_paiement_prestataire.demande_batiment_prestataire',
            'app.paeb.gerer_situation_entreprise.demande_paiement_prestataire.demande_latrine_prestataire',
            'app.paeb.gerer_situation_entreprise.demande_paiement_prestataire.demande_mobilier_prestataire',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.demande_paiement_prestataire', {
            title : 'Demande payement',
            icon  : 'icon-data',
            weight: 1
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
