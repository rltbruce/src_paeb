(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.paiement_mpe', [
            'app.paeb.gerer_situation_entreprise.paiement_mpe.paiement_batiment_prestataire',
            'app.paeb.gerer_situation_entreprise.paiement_mpe.paiement_latrine_prestataire',
            'app.paeb.gerer_situation_entreprise.paiement_mpe.paiement_mobilier_prestataire',

            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.paiement_mpe', {
            title : 'Paiement mpe',
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
